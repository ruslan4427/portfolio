# Feature 02 · Plan

**Companion to:** `spec.md` · **ShipLoop phase:** Plan

## Architecture

```
components/
├── canvas/
│   ├── SceneRoot.tsx          (rewritten — route-gates Canvas, provides fallback)
│   ├── ParticleField.tsx      (new — <Points> with ShaderMaterial)
│   └── shaders.ts             (new — vertex/fragment tagged template strings)
├── sections/
│   └── Hero.tsx               (edited — wraps headline in <SplitReveal>)
└── ui/
    └── SplitReveal.tsx        (new — word-splitter + framer-motion stagger)

lib/
└── motion.ts                  (extended — export easeOutExpo array + stagger presets)

app/
└── page.tsx                   (edited — leaves SceneRoot mounting to itself; no new imports)
```

Rationale:

- **`SceneRoot` gates itself.** Instead of importing/omitting `<SceneRoot>`
  per route, `SceneRoot` reads `usePathname()` and renders `null` on
  `/work/*`. Home stays a single-component composition; case study pages
  don't need to know Canvas exists.
- **Shaders as strings, not files.** One vertex, one fragment, both
  short. Colocated in `shaders.ts`. Wiring Turbopack's `.glsl` rule for
  two 30-line shaders is theater. Revisit if we hit three+ shaders.
- **`SplitReveal` is presentational only.** Takes `children` (string or
  array of strings), splits on whitespace, wraps each word in
  `<span class="inline-block overflow-hidden">…</span>`, animates via
  framer-motion `motion.span` with `staggerChildren`.

## Route gating

```tsx
// components/canvas/SceneRoot.tsx
"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/lib/motion";

const CanvasScene = dynamic(() => import("./CanvasScene"), { ssr: false });

export function SceneRoot() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const isHome = pathname === "/";

  if (!isHome) return null;                    // no background on /work/*
  if (reduce)  return <StaticGradient />;      // reduce-motion path
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <ErrorBoundary fallback={<StaticGradient />}>
        <CanvasScene />
      </ErrorBoundary>
    </div>
  );
}
```

`CanvasScene` is a separate file so the dynamic import can be tree-shaken
out for reduced-motion users — `three` never enters their bundle.

## Particle field

```tsx
// components/canvas/ParticleField.tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

const COUNT = 1800;

export function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds     = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, seeds };
  }, []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader, fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime:    { value: 0 },
      uOpacity: { value: 0 },
      uAccent:  { value: new THREE.Color("#00FF88") },
    },
  }), []);

  useFrame((_, dt) => {
    if (!ref.current || document.visibilityState !== "visible") return;
    material.uniforms.uTime.value += dt;
    material.uniforms.uOpacity.value = Math.min(1, material.uniforms.uOpacity.value + dt * 0.6);
    ref.current.rotation.y += dt * 0.02;
  });

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed"    args={[seeds, 1]} />
      </bufferGeometry>
    </points>
  );
}
```

## Shaders (inline strings)

```ts
// components/canvas/shaders.ts
export const vertexShader = /* glsl */ `
  attribute float aSeed;
  uniform   float uTime;
  varying   float vDepth;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.1 + aSeed) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 3.5 * (30.0 / -mv.z);
    vDepth = clamp(1.0 - (-mv.z / 25.0), 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3  uAccent;
  uniform float uOpacity;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d) * vDepth * uOpacity * 0.55;
    gl_FragColor = vec4(uAccent, a);
  }
`;
```

## SplitReveal

```tsx
// components/ui/SplitReveal.tsx
"use client";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const word      = {
  hidden: { y: "100%" },
  show:   { y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

export function SplitReveal({ children, as = "span", className = "" }: {
  children: string; as?: "h1" | "h2" | "span"; className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    return <Tag className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>{children}</Tag>;
  }

  const words = children.split(/\s+/);
  return (
    <Tag className={className}>
      <motion.span variants={container} initial="hidden" animate="show" className="inline">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-baseline pr-[0.25em]">
            <motion.span variants={word} className="inline-block will-change-transform">{w}</motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
```

Hero integration:

```tsx
// components/sections/Hero.tsx (excerpt)
<SplitReveal as="h1" className="font-display text-[clamp(...)]">
  Ship what Claude writes.
</SplitReveal>
```

## Error boundary

Tiny class component in `components/canvas/CanvasErrorBoundary.tsx` — no
third-party dep. On error, renders the `StaticGradient` component and
`console.warn`s once. In production we can wire it to Vercel Speed
Insights later.

## Non-obvious decisions

- **framer-motion, not GSAP, for SplitText.** GSAP is registered for
  scroll-linked reveals (future sprints) — the per-word Hero reveal
  doesn't need ScrollTrigger, and framer's `stagger` is cheaper than
  writing a custom GSAP timeline.
- **Additive blending + depthWrite: false.** Standard particle-glow
  recipe. Without `depthWrite: false`, later particles occlude earlier
  ones and destroy the depth cue.
- **Rotation on `points`, not on the camera.** Cheaper (one matrix mult
  vs. re-projecting the frustum), and camera stays orthographically clean
  for future scroll-linked camera paths.
- **`gl_PointSize = 3.5 * (30.0 / -mv.z)`.** Perspective-correct point
  size — near particles bigger, far particles smaller — sells depth
  without more geometry.
- **`uOpacity` ramps up from 0 over ~1.6s.** No jarring pop on Canvas mount.

## Rollback plan

- Feature is entirely additive except for the `SceneRoot` rewrite.
- Revert: `git checkout HEAD~N -- components/canvas/ components/ui/SplitReveal.tsx components/sections/Hero.tsx lib/motion.ts` and delete `components/canvas/{CanvasScene,ParticleField,shaders,CanvasErrorBoundary}.tsx`.
- No dependencies to uninstall.
- No content changes, no route changes.

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
};

const PHONE_FINISH =
  "--front: linear-gradient(150deg, #ffd1ad 0%, #f08848 12%, #c9581f 38%, #f3955a 68%, #b44b17 86%, #f6a874 100%); --side: linear-gradient(180deg, #f39a5e 0%, #b64e1b 8%, #d8692d 22%, #ffb07a 46%, #d3652b 68%, #ad4817 90%, #f0955a 100%); --side-lit: linear-gradient(180deg, #ffc49c 0%, #dd7038 8%, #f48a4d 22%, #ffd2b0 46%, #ef8749 68%, #d06530 90%, #ffbe94 100%); --edge: #8a3510; --back: #5c230a; --btn: linear-gradient(90deg, #a9461a, #f7a26a 45%, #ffc8a0 55%, #c45a23); --band: rgba(255,230,210,.6); --ring: #c95f28;";

const phoneSideLayer = (translateZ: number, variant: "side" | "sideLit" = "side") =>
  `<div style="position:absolute;inset:0;border-radius:55px;background:var(--${variant === "sideLit" ? "side-lit" : "side"});transform:translateZ(${translateZ}px)"></div>`;

const PHONE_LAYERS = [
  { z: -46, type: "back", shadow: true },
  { z: -44, type: "edge" },
  { z: -42, type: "side" },
  { z: -40, type: "side" },
  { z: -38, type: "side" },
  { z: -36, type: "side" },
  { z: -34, type: "side" },
  { z: -32, type: "side" },
  { z: -30, type: "side" },
  { z: -28, type: "side" },
  { z: -26, type: "side" },
  { z: -24, type: "sideLit" },
  { z: -22, type: "sideLit" },
  { z: -20, type: "side" },
  { z: -18, type: "side" },
  { z: -16, type: "side" },
  { z: -14, type: "side" },
  { z: -12, type: "side" },
  { z: -10, type: "side" },
  { z: -8, type: "side" },
  { z: -6, type: "side" },
  { z: -4, type: "sideLit" },
  { z: -2, type: "sideLit" },
]
  .map((l) => {
    if (l.type === "back") {
      return `<div style="position:absolute;inset:0;border-radius:55px;background:var(--back);transform:translateZ(${l.z}px);box-shadow:50px 44px 80px rgba(30,30,25,.28), 16px 14px 26px rgba(30,30,25,.18)"></div>`;
    }
    if (l.type === "edge") {
      return `<div style="position:absolute;inset:0;border-radius:55px;background:var(--edge);transform:translateZ(${l.z}px)"></div>`;
    }
    return phoneSideLayer(l.z, l.type as "side" | "sideLit");
  })
  .join("");

const vocabRow = (idx: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, en: string, ua: string) => `
<div class="lx-r${idx} lx-m" style="display:flex;align-items:center;gap:9px;background:#fff;border-radius:12px;padding:10px 12px;box-shadow:0 1px 4px rgba(0,0,0,.07)">
  <span class="lx-g${idx} lx-m" style="width:6px;height:6px;border-radius:50%;background:#cfcfca;flex:none"></span>
  <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px">
    <div style="font-size:13px;font-weight:700">${en}</div>
    <div style="font-size:11px;color:#555">${ua}</div>
  </div>
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"></path></svg>
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d93a3a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"></path></svg>
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2" stroke-linecap="round"><path d="M5 9h14M5 15h14"></path></svg>
</div>`;

const SCENE_HTML = `
<div class="lx-dots lx-m" style="position:absolute;inset:0"></div>

<svg width="1312" height="816" viewBox="0 0 1312 816" fill="none" style="position:absolute;inset:0;pointer-events:none">
  <circle class="lx-arc lx-m" cx="0" cy="920" r="622" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
  <circle class="lx-arc lx-arc2 lx-m" cx="0" cy="920" r="532" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
</svg>

<div class="lx-phone lx-m" style="position:absolute;left:731px;top:159px;width:376px;height:688px">
  <div class="lx-float" style="width:100%;height:100%">
    <div style="${PHONE_FINISH}position:relative;width:100%;height:100%;transform-style:preserve-3d;transform:scale(1.1) perspective(1800px) rotateY(-21deg) rotateX(4deg)">
      ${PHONE_LAYERS}
      <div style="position:absolute;left:369.5px;top:186px;width:13px;height:98px;border-radius:6.5px;background:var(--btn);box-shadow:0 0 0 .5px rgba(0,0,0,.25);transform:translateZ(-23px) rotateY(90deg) translateZ(2px)"></div>
      <div style="position:absolute;left:370px;top:392px;width:12px;height:66px;border-radius:6px;background:linear-gradient(90deg, #121214, #3b3b40 50%, #121214);box-shadow:0 0 0 1.5px var(--ring);transform:translateZ(-23px) rotateY(90deg) translateZ(0.6px)"></div>
      <div style="position:absolute;left:-6.5px;top:128px;width:13px;height:30px;border-radius:6.5px;background:var(--btn);box-shadow:0 0 0 .5px rgba(0,0,0,.25);transform:translateZ(-23px) rotateY(-90deg) translateZ(2px)"></div>
      <div style="position:absolute;left:-6.5px;top:184px;width:13px;height:58px;border-radius:6.5px;background:var(--btn);box-shadow:0 0 0 .5px rgba(0,0,0,.25);transform:translateZ(-23px) rotateY(-90deg) translateZ(2px)"></div>
      <div style="position:absolute;left:-6.5px;top:254px;width:13px;height:58px;border-radius:6.5px;background:var(--btn);box-shadow:0 0 0 .5px rgba(0,0,0,.25);transform:translateZ(-23px) rotateY(-90deg) translateZ(2px)"></div>

      <div style="position:absolute;inset:0;box-sizing:border-box;padding:4.5px;border-radius:55px;background:var(--front);box-shadow:inset 0 0 0 .6px rgba(255,255,255,.5), inset 0 1.5px 1px rgba(255,255,255,.4), 0 0 0 .5px rgba(0,0,0,.35)">
        <div style="position:absolute;top:0;left:70px;width:3px;height:3px;background:var(--band)"></div>
        <div style="position:absolute;top:0;right:70px;width:3px;height:3px;background:var(--band)"></div>
        <div style="position:absolute;bottom:0;left:70px;width:3px;height:3px;background:var(--band)"></div>
        <div style="position:absolute;bottom:0;right:70px;width:3px;height:3px;background:var(--band)"></div>
        <div style="position:relative;width:100%;height:100%;box-sizing:border-box;padding:9px;border-radius:52px;background:#020202;box-shadow:inset 0 0 0 1px #000, inset 0 0 0 1.5px rgba(255,255,255,.06)">
          <div style="position:relative;width:100%;height:100%;border-radius:43px;background:#f6f6f8;overflow:hidden;display:flex;flex-direction:column;gap:8px;padding:10px 14px 0;box-sizing:border-box;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.35)">
            <div style="position:relative;align-self:center;width:96px;height:28px;border-radius:14px;background:#000;flex:none">
              <div style="position:absolute;right:10px;top:8px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 40% 38%, #3a4c78 0%, #141a2a 35%, #050505 70%)"></div>
            </div>

            <div class="lx-top lx-m" style="display:flex;justify-content:flex-end;align-items:center;gap:16px;padding:6px 2px 0;flex:none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"></path></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"></path></svg>
              <div style="position:relative;width:34px;height:34px">
                <span class="lx-ring-pulse" style="position:absolute;inset:0;border-radius:50%;background:#1677ff"></span>
                <button aria-label="Play" style="position:relative;width:34px;height:34px;border:0;border-radius:50%;background:#1677ff;display:flex;align-items:center;justify-content:center;padding:0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M7 4v16l13-8z"></path></svg>
                </button>
              </div>
            </div>

            <div style="height:14px;flex:none"></div>
            <div class="lx-top lx-m" style="display:flex;align-items:center;gap:8px;height:30px;padding:0 10px;border-radius:10px;background:#e9e9ec;color:#9a9aa0;font-size:11px;flex:none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
              <span>Search words</span>
            </div>

            <div style="display:flex;flex-direction:column;gap:7px;padding-top:2px">
              ${vocabRow(0, "Follow up", "уточнити")}
              ${vocabRow(1, "Proposal", "пропозиція")}
              ${vocabRow(2, "Contract", "договір")}
              ${vocabRow(3, "Agenda", "порядок денний")}
              ${vocabRow(4, "Budget", "бюджет")}
              ${vocabRow(5, "Invoice", "рахунок")}
              ${vocabRow(6, "Deadline", "термін")}
              ${vocabRow(7, "Meeting", "зустріч")}
            </div>

            <div style="position:absolute;left:50%;bottom:8px;width:110px;height:4px;margin-left:-55px;border-radius:2px;background:#111"></div>
          </div>
          <div style="position:absolute;inset:0;border-radius:51.5px;pointer-events:none;background:linear-gradient(114deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,.06) 22%, rgba(255,255,255,0) 34%), linear-gradient(114deg, rgba(255,255,255,0) 58%, rgba(255,255,255,.09) 63%, rgba(255,255,255,0) 70%)"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="lx-pill lx-m" style="position:absolute;left:656px;top:224px;transform-origin:50% 50%">
  <div class="lx-float3" style="padding:14px 22px;border-radius:999px;background:#1f1f20;color:#fff;font-size:21px;font-weight:500;letter-spacing:-.01em;box-shadow:0 10px 24px rgba(0,0,0,.18);white-space:nowrap">Business English Vocab</div>
</div>

<div class="lx-lesson lx-m" style="position:absolute;left:520px;top:405px">
  <div class="lx-float2" style="display:flex;align-items:center;gap:20px;width:360px;height:108px;box-sizing:border-box;padding:14px 18px 14px 14px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.12)">
    <div style="width:78px;height:78px;flex:none;box-sizing:border-box;border-radius:10px;border:1px solid #e4e4e4;background:#f7f7f8;padding:7px 6px;display:flex;flex-direction:column;gap:4px;overflow:hidden">
      <div style="height:9px;border-radius:3px;background:#fff;box-shadow:0 0 0 .5px #ddd"></div>
      <div style="height:9px;border-radius:3px;background:#fff;box-shadow:0 0 0 .5px #ddd"></div>
      <div style="height:9px;border-radius:3px;background:#fff;box-shadow:0 0 0 .5px #ddd"></div>
      <div style="height:9px;border-radius:3px;background:#fff;box-shadow:0 0 0 .5px #ddd"></div>
      <div style="height:9px;border-radius:3px;background:#fff;box-shadow:0 0 0 .5px #ddd"></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="font-size:15px;color:#6b6b6b;letter-spacing:.02em">TOPIC (UKR) · LIST (UKR)</div>
      <div style="font-size:26px;font-weight:600;letter-spacing:-.02em">Lesson 1 - Intro</div>
    </div>
  </div>
</div>

<div class="lx-status lx-m" style="position:absolute;left:986px;top:653px">
  <div class="lx-float3" style="width:262px;box-sizing:border-box;padding:16px 20px 14px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.12);display:flex;flex-direction:column;gap:4px">
    <div style="font-size:16px;color:#6b6b6b;letter-spacing:.02em">STATUS ·</div>
    <div class="lx-word lx-m" style="font-size:27px;font-weight:800;color:#1c8f4e;white-space:nowrap">Active Learning</div>
    <div style="height:4px;border-radius:2px;background:#ececea;margin-top:6px;overflow:hidden">
      <div class="lx-bar lx-m" style="height:100%;background:#1c8f4e;transform-origin:0 50%"></div>
    </div>
  </div>
</div>
`;

export function AnimatedCover({ src, alt, sizes }: Props) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover lx-cover-fallback"
      />
      <div className="lx-cover-wrap" aria-label={alt}>
        <div
          className="lx-cover-scene"
          dangerouslySetInnerHTML={{ __html: SCENE_HTML }}
        />
      </div>
    </>
  );
}

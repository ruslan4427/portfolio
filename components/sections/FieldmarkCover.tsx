import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
};

const PHONE_FINISH =
  "--front: linear-gradient(150deg, #6a6a6e 0%, #2e2e31 12%, #1a1a1c 38%, #3a3a3e 68%, #161618 86%, #505054 100%); --side: linear-gradient(180deg, #4a4a4e 0%, #1f1f22 8%, #2c2c30 22%, #5a5a5f 46%, #2c2c30 68%, #1c1c1f 90%, #46464a 100%); --side-lit: linear-gradient(180deg, #707075 0%, #333337 8%, #45454a 22%, #8a8a90 46%, #45454a 68%, #303034 90%, #6a6a6f 100%); --edge: #111113; --back: #0a0a0b; --btn: linear-gradient(90deg, #1e1e21, #5c5c61 45%, #7a7a80 55%, #26262a); --band: rgba(160,160,170,.35); --ring: #3a3a3e;";

const phoneSideLayer = (translateZ: number, variant: "side" | "sideLit" = "side") =>
  `<div style="position:absolute;inset:0;border-radius:55px;background:var(--${variant === "sideLit" ? "side-lit" : "side"});transform:translateZ(${translateZ}px)"></div>`;

const PHONE_LAYERS = [
  { z: -46, type: "back" },
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
      return `<div style="position:absolute;inset:0;border-radius:55px;background:var(--back);transform:translateZ(${l.z}px);box-shadow:22px 40px 80px rgba(30,30,25,.26), 6px 14px 26px rgba(30,30,25,.16)"></div>`;
    }
    if (l.type === "edge") {
      return `<div style="position:absolute;inset:0;border-radius:55px;background:var(--edge);transform:translateZ(${l.z}px)"></div>`;
    }
    return phoneSideLayer(l.z, l.type as "side" | "sideLit");
  })
  .join("");

const planRow = (
  idx: 0 | 1 | 2 | 3,
  title: string,
  revision: string,
  markers: string,
  dots: Array<{ color: string; count: string }>,
) => {
  const dotsHtml = dots
    .map(
      (d) =>
        `<span style="display:inline-flex;align-items:center;gap:3px"><span style="width:5.5px;height:5.5px;border-radius:50%;background:${d.color}"></span>${d.count}</span>`,
    )
    .join("");
  return `
<div style="position:relative;overflow:hidden;display:flex;align-items:center;gap:14px;padding:11px 16px 11px 14px;border-radius:10px;background:#f1f2f7;box-shadow:0 1px 2px rgba(0,0,0,.14), 0 0 1px rgba(0,0,0,.06)">
  <div style="width:38px;height:38px;flex:none;border-radius:8px;background:#dce3f7;display:flex;align-items:center;justify-content:center">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#454b59" stroke-width="1.7" stroke-linejoin="round">
      <path d="M4 7v13h13"></path>
      <rect x="7.5" y="3" width="13" height="13.5" rx="1.2"></rect>
      <text x="14" y="11.6" text-anchor="middle" font-size="4.6" font-family="Roboto, sans-serif" font-weight="700" fill="#454b59" stroke="none">PDF</text>
    </svg>
  </div>
  <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
    <div style="font-size:13.5px;font-weight:500;letter-spacing:.05em;line-height:1.55;color:#1b1b1f">${title}<br>${revision}</div>
    <div style="display:flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.04em;color:#6c6f78">
      <span>${markers}</span>
      <span class="fm-d${idx} fm-m" style="display:inline-flex;align-items:center;gap:7px;color:#2a2c31">${dotsHtml}</span>
    </div>
  </div>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a2c31" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="m9 6 6 6-6 6"></path></svg>
</div>`;
};

const SCENE_HTML = `
<div class="fm-dots fm-m" style="position:absolute;inset:0"></div>

<svg width="1312" height="816" viewBox="0 0 1312 816" fill="none" style="position:absolute;inset:0;pointer-events:none">
  <circle class="fm-arc fm-m" cx="0" cy="920" r="622" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
  <circle class="fm-arc fm-arc2 fm-m" cx="0" cy="920" r="532" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
</svg>

<div class="fm-scene fm-m" style="position:absolute;inset:0">
  <div class="fm-phone fm-m" style="position:absolute;left:731px;top:136px;width:376px;height:784px">
    <div style="width:100%;height:100%">
      <div class="fm-phone3d fm-m" style="${PHONE_FINISH}position:relative;width:100%;height:100%;transform-style:preserve-3d;transform:scale(1.1) perspective(1800px) translate3d(0,0,0) rotateX(0deg) rotateY(0deg) rotateZ(0deg)">
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
            <div style="position:relative;width:100%;height:100%;border-radius:43px;background:#f8f8fd;overflow:hidden;box-sizing:border-box;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.35);font-family:Roboto, 'Helvetica Neue', sans-serif;color:#1b1b1f">
              <div style="position:absolute;left:50%;top:11px;width:108px;height:31px;margin-left:-54px;border-radius:16px;background:#000">
                <div style="position:absolute;right:11px;top:9.5px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 40% 38%, #3a4c78 0%, #141a2a 35%, #050505 70%)"></div>
              </div>
              <div style="position:absolute;left:0;right:0;top:0;height:53px;display:flex;align-items:center;justify-content:space-between;padding:0 24px 0 42px;box-sizing:border-box">
                <span style="font-size:14.5px;font-weight:500;letter-spacing:.01em">10:04</span>
                <div style="display:flex;align-items:center;gap:6px">
                  <svg width="18" height="6" viewBox="0 0 18 6"><circle cx="2" cy="3" r="1.6" fill="#b9bbc2"></circle><circle cx="6.6" cy="3" r="1.6" fill="#b9bbc2"></circle><circle cx="11.2" cy="3" r="1.6" fill="#b9bbc2"></circle><circle cx="15.8" cy="3" r="1.6" fill="#b9bbc2"></circle></svg>
                  <svg width="15" height="12" viewBox="0 0 24 18" fill="#111"><path d="M12 17.5 8.6 13.9a4.8 4.8 0 0 1 6.8 0z"></path><path d="M5.7 11a8.9 8.9 0 0 1 12.6 0l-1.8 1.9a6.3 6.3 0 0 0-9 0z"></path><path d="M2.8 8.1a13 13 0 0 1 18.4 0l-1.8 1.9a10.4 10.4 0 0 0-14.8 0z"></path><path d="M0 5.2a17 17 0 0 1 24 0l-1.8 1.9a14.4 14.4 0 0 0-20.4 0z"></path></svg>
                  <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".7" y=".7" width="21" height="10.6" rx="3" stroke="#111" stroke-width="1.2"></rect><rect x="2.4" y="2.4" width="17.6" height="7.2" rx="1.6" fill="#111"></rect><path d="M23.3 4.2v3.6" stroke="#111" stroke-width="1.4" stroke-linecap="round"></path></svg>
                </div>
              </div>
              <div style="position:absolute;left:0;right:0;top:60px;height:40px;display:flex;align-items:center;padding:0 16px 0 14px;box-sizing:border-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1b1b1f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"></path></svg>
                <span style="margin-left:26px;font-size:18px;font-weight:400;flex:1">Sst</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b1b1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"></path><path d="M10 20.5a2 2 0 0 0 4 0"></path></svg>
              </div>
              <div style="position:absolute;left:13px;right:13px;top:112px;display:flex;flex-direction:column;gap:10px">
                ${planRow(0, "SST Willow Creek", "P2_TS_R1.7 2", "24 markers", [
                  { color: "#2e7d32", count: "21" },
                  { color: "#ef6c00", count: "3" },
                ])}
                ${planRow(1, "SST Willow Creek", "P2_T_R1.10", "90 markers", [
                  { color: "#2e7d32", count: "86" },
                  { color: "#1565c0", count: "2" },
                  { color: "#ef6c00", count: "2" },
                ])}
                ${planRow(2, "SST Willow Creek", "P2_TS_R1.7", "10 markers", [
                  { color: "#2e7d32", count: "8" },
                  { color: "#c62828", count: "1" },
                  { color: "#ef6c00", count: "1" },
                ])}
                ${planRow(3, "Flore1", "", "5 markers", [
                  { color: "#2e7d32", count: "1" },
                  { color: "#1565c0", count: "3" },
                  { color: "#c62828", count: "1" },
                ])}
              </div>
              <div style="position:absolute;left:0;right:0;bottom:0;height:100px;background:#eceef5;display:flex;justify-content:space-around;padding:12px 10px 0;box-sizing:border-box">
                <div style="display:flex;flex-direction:column;align-items:center;gap:6px;width:80px">
                  <div style="width:56px;height:28px;border-radius:14px;background:#d9e1f8;display:flex;align-items:center;justify-content:center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#3c4150"><path d="M3 5.5 9 3l6 2.5L21 3v15.5L15 21l-6-2.5L3 21z"></path><path d="M9 3v15.5M15 5.5V21" stroke="#d9e1f8" stroke-width="1.2"></path></svg>
                  </div>
                  <span style="font-size:11px;font-weight:500;letter-spacing:.05em">Plans</span>
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:6px;width:80px">
                  <div style="width:56px;height:28px;display:flex;align-items:center;justify-content:center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3c4150" stroke-width="1.9" stroke-linejoin="round"><rect x="4.5" y="4" width="15" height="17" rx="1.8"></rect><path d="M9 4V2.8h6V4M8 10h8M8 13.5h8M8 17h5" stroke-linecap="round"></path></svg>
                  </div>
                  <span style="font-size:11px;letter-spacing:.05em;color:#3a3d45">Tasks</span>
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:6px;width:80px">
                  <div style="width:56px;height:28px;display:flex;align-items:center;justify-content:center">
                    <svg width="20" height="18" viewBox="0 0 26 22" fill="none" stroke="#3c4150" stroke-width="1.9" stroke-linecap="round"><circle cx="9.5" cy="7" r="3.6"></circle><path d="M2.5 19c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6z" stroke-linejoin="round"></path><path d="M16.5 3.6a3.6 3.6 0 0 1 0 6.9M19.2 13.8c2 .8 3.4 2.5 3.9 5.2"></path></svg>
                  </div>
                  <span style="font-size:11px;letter-spacing:.05em;color:#3a3d45">Team</span>
                </div>
              </div>
              <div style="position:absolute;left:50%;bottom:8px;width:110px;height:4px;margin-left:-55px;border-radius:2px;background:#111"></div>
            </div>
            <div style="position:absolute;inset:0;border-radius:51.5px;pointer-events:none;background:linear-gradient(114deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,.06) 22%, rgba(255,255,255,0) 34%), linear-gradient(114deg, rgba(255,255,255,0) 58%, rgba(255,255,255,.09) 63%, rgba(255,255,255,0) 70%)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="fm-pill fm-m" style="position:absolute;left:640px;top:168px;transform-origin:50% 50%">
    <div class="fm-par1 fm-m" style="padding:14px 22px;border-radius:999px;background:#1f1f20;color:#fff;font-size:21px;font-weight:500;letter-spacing:-.01em;box-shadow:0 10px 24px rgba(0,0,0,.18);white-space:nowrap">SST Willow Creek</div>
  </div>

  <div class="fm-lesson fm-m" style="position:absolute;left:520px;top:377px">
    <div class="fm-par2 fm-m" style="display:flex;align-items:center;gap:20px;width:360px;height:108px;box-sizing:border-box;padding:14px 18px 14px 14px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.12)">
      <div style="flex:none;width:78px;height:78px">
        <svg width="78" height="78" viewBox="0 0 78 78" fill="none">
          <rect x="0.5" y="0.5" width="77" height="77" rx="10" fill="#f7f8fb" stroke="#e1e3ea"></rect>
          <path d="M10 12h58v54H10z" stroke="#3f4552" stroke-width="2"></path>
          <path d="M38 12v20M38 40v26M10 38h18M34 38h4M46 38h22M54 38v28" stroke="#3f4552" stroke-width="1.4"></path>
          <path d="M14 16h20v18H14zM42 16h22v18H42z" fill="#e8ecf8"></path>
          <g class="fm-pin fm-p0 fm-m"><path d="M22 31c-3.2-3.6-4.8-6.2-4.8-8.4a4.8 4.8 0 0 1 9.6 0c0 2.2-1.6 4.8-4.8 8.4z" fill="#2e7d32" stroke="#fff" stroke-width="1.2"></path><circle cx="22" cy="22.6" r="1.6" fill="#fff"></circle></g>
          <g class="fm-pin fm-p1 fm-m"><path d="M53 55c-3.2-3.6-4.8-6.2-4.8-8.4a4.8 4.8 0 0 1 9.6 0c0 2.2-1.6 4.8-4.8 8.4z" fill="#1565c0" stroke="#fff" stroke-width="1.2"></path><circle cx="53" cy="46.6" r="1.6" fill="#fff"></circle></g>
          <g class="fm-pin fm-p2 fm-m"><path d="M27 59c-3.2-3.6-4.8-6.2-4.8-8.4a4.8 4.8 0 0 1 9.6 0c0 2.2-1.6 4.8-4.8 8.4z" fill="#ef6c00" stroke="#fff" stroke-width="1.2"></path><circle cx="27" cy="50.6" r="1.6" fill="#fff"></circle></g>
          <g class="fm-pin fm-p3 fm-m"><path d="M60 29c-3.2-3.6-4.8-6.2-4.8-8.4a4.8 4.8 0 0 1 9.6 0c0 2.2-1.6 4.8-4.8 8.4z" fill="#c62828" stroke="#fff" stroke-width="1.2"></path><circle cx="60" cy="20.6" r="1.6" fill="#fff"></circle></g>
        </svg>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="font-size:15px;color:#6b6b6b;letter-spacing:.02em">PLAN · PDF</div>
        <div style="font-size:26px;font-weight:600;letter-spacing:-.02em">P2_T_R1.10</div>
      </div>
    </div>
  </div>

  <div class="fm-status fm-m" style="position:absolute;left:976px;top:608px">
    <div class="fm-par3 fm-m" style="width:284px;box-sizing:border-box;padding:16px 20px 16px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.12);display:flex;flex-direction:column;gap:6px">
      <div style="font-size:16px;color:#6b6b6b;letter-spacing:.02em">MARKERS ·</div>
      <div class="fm-word fm-m" style="display:flex;align-items:baseline;gap:8px;white-space:nowrap">
        <span style="font-size:30px;font-weight:800">129</span>
        <span style="font-size:15px;font-weight:600;color:#6b6b6b">on 4 plans</span>
      </div>
      <div class="fm-bar fm-m" style="display:flex;gap:2px;height:6px;margin-top:2px;border-radius:3px;overflow:hidden;transform-origin:0 50%">
        <div style="flex:116;background:#2e7d32"></div><div style="flex:6;background:#ef6c00"></div><div style="flex:5;background:#1565c0"></div><div style="flex:2;background:#c62828"></div>
      </div>
      <div style="display:flex;gap:14px;font-size:13px;font-weight:600;color:#333">
        <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:#2e7d32"></span>116</span>
        <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:#ef6c00"></span>6</span>
        <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:#1565c0"></span>5</span>
        <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:#c62828"></span>2</span>
      </div>
    </div>
  </div>
</div>
`;

export function FieldmarkCover({ src, alt, sizes }: Props) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover fm-cover-fallback"
      />
      <div className="fm-cover-wrap" aria-label={alt}>
        <div
          className="fm-cover-scene"
          dangerouslySetInnerHTML={{ __html: SCENE_HTML }}
        />
      </div>
    </>
  );
}

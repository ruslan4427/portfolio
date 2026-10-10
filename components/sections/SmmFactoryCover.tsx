import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
};

const PHONE_FINISH =
  "--front: linear-gradient(150deg, #eef4fb 0%, #b9cbe0 12%, #8ea6c2 38%, #c3d4e7 68%, #8299b6 86%, #d6e3f1 100%); --side: linear-gradient(180deg, #c4d4e6 0%, #8aa1bd 8%, #a1b6cf 22%, #dde8f3 46%, #9fb4cd 68%, #869cb8 90%, #c0d1e4 100%); --side-lit: linear-gradient(180deg, #e3ecf6 0%, #a9bdd4 8%, #bfd0e3 22%, #f3f7fc 46%, #bdcee2 68%, #a5b9d1 90%, #dee8f3 100%); --edge: #6e84a0; --back: #55697f; --btn: linear-gradient(90deg, #8399b5, #d9e5f2 45%, #eef4fa 55%, #91a7c2); --band: rgba(80,100,130,.35); --ring: #9fb4cd;";

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
      return `<div style="position:absolute;inset:0;border-radius:55px;background:var(--back);transform:translateZ(${l.z}px)"></div>`;
    }
    if (l.type === "edge") {
      return `<div style="position:absolute;inset:0;border-radius:55px;background:var(--edge);transform:translateZ(${l.z}px)"></div>`;
    }
    return phoneSideLayer(l.z, l.type as "side" | "sideLit");
  })
  .join("");

const channelIcon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3b3a3b" stroke-width="1.9" stroke-linecap="round"><path d="M9.5 3 7.5 21M16.5 3l-2 18M4 8.5h17M3 15.5h17"></path></svg>`;

const channelRow = (
  highlight: "sm-h0" | "sm-h1" | "sm-h2" | "sm-h3" | "sm-h4" | null,
  label: string,
) => `
<div style="position:relative;height:39.4px;display:flex;align-items:center;gap:13px;padding-left:17px">
  ${highlight ? `<span class="${highlight} sm-m" style="position:absolute;inset:0;background:#f2e7f3"></span>` : ""}
  <span style="position:relative;display:flex">${channelIcon}</span>
  <span style="position:relative;font-size:14.5px;color:#1d1c1d">${label}</span>
</div>`;

const SCENE_HTML = `
<div class="sm-dots sm-m" style="position:absolute;inset:0"></div>

<svg width="1312" height="816" viewBox="0 0 1312 816" fill="none" style="position:absolute;inset:0;pointer-events:none">
  <circle class="sm-arc sm-m" cx="0" cy="920" r="622" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
  <circle class="sm-arc sm-arc2 sm-m" cx="0" cy="920" r="532" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
</svg>

<div class="sm-scene sm-m" style="position:absolute;inset:0">
  <div class="sm-phone sm-m" style="position:absolute;left:731px;top:136px;width:376px;height:784px">
    <div class="sm-pshadow sm-m" style="position:absolute;left:30px;right:-10px;top:50px;bottom:-40px;border-radius:70px;background:rgba(40,28,45,.26);filter:blur(34px)"></div>
    <div style="width:100%;height:100%">
      <div class="sm-phone3d sm-m" style="${PHONE_FINISH}position:relative;width:100%;height:100%;transform-style:preserve-3d;transform:scale(1.1) perspective(1600px) translate3d(0,0,0) rotateX(5deg) rotateY(-15deg) rotateZ(0)">
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
            <div style="position:relative;width:100%;height:100%;border-radius:43px;background:#ffffff;overflow:hidden;box-sizing:border-box;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.35);font-family:Lato, 'Helvetica Neue', sans-serif;color:#1d1c1d">
              <div style="position:absolute;left:0;right:0;top:0;height:91px;background:linear-gradient(160deg, #5c1d5e 0%, #46114b 55%, #3a0c3e 100%)"></div>
              <div style="position:absolute;left:50%;top:11px;width:108px;height:31px;margin-left:-54px;border-radius:16px;background:#000">
                <div style="position:absolute;right:11px;top:9.5px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 40% 38%, #3a4c78 0%, #141a2a 35%, #050505 70%)"></div>
              </div>
              <div style="position:absolute;left:0;right:0;top:0;height:46px;display:flex;align-items:center;justify-content:space-between;padding:0 24px 0 42px;box-sizing:border-box;color:#160817">
                <span style="font-size:15px;font-weight:700">6:17</span>
                <div style="display:flex;align-items:center;gap:6px">
                  <svg width="17" height="11" viewBox="0 0 17 11" fill="#160817"><rect x="0" y="7" width="3" height="4" rx=".8"></rect><rect x="4.6" y="5" width="3" height="6" rx=".8"></rect><rect x="9.2" y="2.6" width="3" height="8.4" rx=".8"></rect><rect x="13.8" y="0" width="3" height="11" rx=".8"></rect></svg>
                  <svg width="15" height="12" viewBox="0 0 24 18" fill="#160817"><path d="M12 17.5 8.6 13.9a4.8 4.8 0 0 1 6.8 0z"></path><path d="M5.7 11a8.9 8.9 0 0 1 12.6 0l-1.8 1.9a6.3 6.3 0 0 0-9 0z"></path><path d="M2.8 8.1a13 13 0 0 1 18.4 0l-1.8 1.9a10.4 10.4 0 0 0-14.8 0z"></path><path d="M0 5.2a17 17 0 0 1 24 0l-1.8 1.9a14.4 14.4 0 0 0-20.4 0z"></path></svg>
                  <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".7" y=".7" width="21" height="10.6" rx="3" stroke="#160817" stroke-opacity=".55" stroke-width="1.2"></rect><rect x="2.4" y="2.4" width="4.6" height="7.2" rx="1.6" fill="#f5c400"></rect><path d="M23.3 4.2v3.6" stroke="#160817" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"></path></svg>
                </div>
              </div>
              <div style="position:absolute;left:14px;right:14px;top:42px;height:40px;display:flex;align-items:center;gap:12px">
                <div style="width:39px;height:39px;flex:none;border-radius:50%;background:#ffffff;display:flex;align-items:center;justify-content:center">
                  <svg width="27" height="27" viewBox="0 0 28 28"><path d="M2 13a12 12 0 0 1 24 0z" fill="#3fb6d8"></path><path d="M2 15.2h24a12 12 0 0 1-24 0z" fill="#d6294f"></path><path d="M14 1v12" stroke="#fff" stroke-width="1.6"></path></svg>
                </div>
                <span style="flex:1;font-size:18.5px;font-weight:900;color:#ffffff;letter-spacing:-.01em">Noblelink</span>
                <div style="flex:none;width:85px;height:39px;border-radius:20px;background:#f8eef8;display:flex;align-items:center;justify-content:space-between;padding:0 4px 0 15px;box-sizing:border-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d1c1d" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M7 12h10M10 17h4"></path></svg>
                  <div style="position:relative;width:30px;height:30px;border-radius:50%;background:#2a1c17;display:flex;align-items:center;justify-content:center;font-family:Georgia, serif;font-size:5px;letter-spacing:.04em;color:#e9dcc8">NOBLE
                    <span style="position:absolute;right:-2px;bottom:0;width:10px;height:10px;border-radius:50%;background:#2bac76;box-shadow:0 0 0 1.5px #f8eef8"></span>
                  </div>
                </div>
              </div>
              <div style="position:absolute;left:15px;top:105px;display:flex;gap:8px;white-space:nowrap">
                <div style="flex:none;width:104px;height:80px;box-sizing:border-box;border:1px solid #dedcde;border-radius:10px;padding:11px 13px;display:flex;flex-direction:column;gap:7px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a3b7c" stroke-width="1.9" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"></path><path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"></path></svg>
                  <div style="font-size:12.5px;line-height:1.45;color:#1d1c1d">Slackbot<br><span style="color:#5e5d60">Ask anything</span></div>
                </div>
                <div style="flex:none;width:89px;height:80px;box-sizing:border-box;border:1px solid #dedcde;border-radius:10px;padding:11px 13px;display:flex;flex-direction:column;gap:7px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1c1d" stroke-width="1.8" stroke-linecap="round"><path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z" stroke-linejoin="round"></path><path d="M8.5 10.5h7M8.5 13.5h4.5"></path></svg>
                  <div style="font-size:12.5px;line-height:1.45;color:#1d1c1d">Threads<br><span style="color:#5e5d60">0 new</span></div>
                </div>
                <div style="flex:none;width:89px;height:80px;box-sizing:border-box;border:1px solid #dedcde;border-radius:10px;padding:11px 13px;display:flex;flex-direction:column;gap:7px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1c1d" stroke-width="1.8" stroke-linecap="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3"></path><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"></rect><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"></rect></svg>
                  <div style="font-size:12.5px;line-height:1.45;color:#1d1c1d">Huddles<br><span style="color:#5e5d60">0 live</span></div>
                </div>
                <div style="flex:none;width:89px;height:80px;box-sizing:border-box;border:1px solid #dedcde;border-radius:10px;padding:11px 13px;display:flex;flex-direction:column;gap:7px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1c1d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m8 12.3 2.6 2.6L16 9.5"></path></svg>
                  <div style="font-size:12.5px;line-height:1.45;color:#1d1c1d">To-dos<br><span style="color:#5e5d60">0 items</span></div>
                </div>
              </div>
              <div style="position:absolute;left:0;right:0;top:199px;height:1px;background:#e8e6e8"></div>
              <div style="position:absolute;left:0;right:0;top:213px;height:28px;display:flex;align-items:center;gap:13px;padding:0 13px 0 17px;box-sizing:border-box">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3b3a3b" stroke-width="1.9" stroke-linecap="round"><path d="M9.5 3 7.5 21M16.5 3l-2 18M4 8.5h17M3 15.5h17"></path></svg>
                <span style="font-size:13.5px;font-weight:900;flex:1">Channels ›</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b3a3b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 15 7-7 7 7"></path></svg>
              </div>
              <div style="position:absolute;left:0;right:0;top:246px;display:flex;flex-direction:column">
                ${channelRow(null, "all-noblelink")}
                ${channelRow("sm-h0", "noble-agent-analytics")}
                ${channelRow("sm-h1", "noble-agent-content")}
                ${channelRow("sm-h2", "noble-agent-engagement")}
                ${channelRow("sm-h3", "noble-agent-publisher")}
                ${channelRow("sm-h4", "noble-agent-strategist")}
                ${channelRow(null, "noblelink")}
                ${channelRow(null, "social")}
                <div style="position:relative;height:39.4px;display:flex;align-items:center;gap:13px;padding-left:17px">
                  <span style="position:relative;display:flex"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3b3a3b" stroke-width="1.9" stroke-linecap="round"><path d="M12 3v18M3 12h18"></path></svg></span>
                  <span style="position:relative;font-size:14.5px;color:#1d1c1d">Add channel</span>
                </div>
              </div>
              <div style="position:absolute;left:0;right:0;top:608px;height:1px;background:#e8e6e8"></div>
              <div style="position:absolute;left:0;right:0;top:621px;height:28px;display:flex;align-items:center;gap:13px;padding:0 17px;box-sizing:border-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1c1d" stroke-width="1.8" stroke-linejoin="round"><path d="M9 6.5a5.5 5.5 0 0 1 10.2 4.2l.8 3-3-.8"></path><path d="M10 10a5.5 5.5 0 1 0-4.8 8.2L3.5 20l1.2-3"></path></svg>
                <span style="font-size:13.5px;font-weight:900">Direct Messages ›</span>
              </div>
              <div style="position:absolute;right:22px;top:618px;width:49px;height:49px;border-radius:50%;background:#4a154b;box-shadow:0 4px 12px rgba(74,21,75,.35);display:flex;align-items:center;justify-content:center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 4v16M4 12h16"></path></svg>
              </div>
              <div style="position:absolute;left:20px;top:682px;width:247px;height:54px;border-radius:27px;background:#f6f6f6;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:space-around;padding:0 4px;box-sizing:border-box;font-size:9.5px;font-weight:700">
                <div style="width:64px;height:46px;border-radius:23px;background:#e6e5e6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#4a154b">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#4a154b"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"></path><rect x="10.5" y="12.5" width="3" height="3" rx=".6" fill="#e6e5e6"></rect></svg>Home
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1c1d" stroke-width="1.8" stroke-linejoin="round"><path d="M9 6.5a5.5 5.5 0 0 1 10.2 4.2l.8 3-3-.8"></path><path d="M10 10a5.5 5.5 0 1 0-4.8 8.2L3.5 20l1.2-3"></path></svg>DMs
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1c1d" stroke-width="1.8" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"></path><path d="M10 20.5a2 2 0 0 0 4 0"></path></svg>Activity
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1d1c1d"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>More
                </div>
              </div>
              <div style="position:absolute;left:276px;top:682px;width:54px;height:54px;border-radius:50%;background:#f6f6f6;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d1c1d" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
              </div>
              <div style="position:absolute;left:50%;bottom:8px;width:110px;height:4px;margin-left:-55px;border-radius:2px;background:#111"></div>
            </div>
            <div class="sm-sheen sm-m" style="position:absolute;inset:0;border-radius:51.5px;pointer-events:none"></div>
            <div style="position:absolute;inset:0;border-radius:51.5px;pointer-events:none;background:linear-gradient(114deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,.06) 22%, rgba(255,255,255,0) 34%), linear-gradient(114deg, rgba(255,255,255,0) 58%, rgba(255,255,255,.09) 63%, rgba(255,255,255,0) 70%)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="sm-pill sm-m" style="position:absolute;left:572px;top:120px;transform-origin:100% 50%">
    <div class="sm-par1 sm-m" style="padding:14px 22px;border-radius:999px;background:#1f1f20;color:#fff;font-size:21px;font-weight:500;letter-spacing:-.01em;box-shadow:0 10px 24px rgba(0,0,0,.18);white-space:nowrap">SMM Factory</div>
  </div>

  <div class="sm-lesson sm-m" style="position:absolute;left:432px;top:437px">
    <div class="sm-par2 sm-m" style="display:flex;align-items:center;gap:18px;width:404px;height:108px;box-sizing:border-box;padding:14px 18px 14px 14px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.12)">
      <div style="flex:none;width:78px;height:78px">
        <svg width="78" height="78" viewBox="0 0 78 78" fill="none">
          <rect x="0.5" y="0.5" width="77" height="77" rx="10" fill="#faf6fa" stroke="#e7dfe7"></rect>
          <circle cx="15" cy="20" r="6" fill="#7a3b7c"></circle>
          <rect x="25" y="15" width="40" height="4" rx="2" fill="#3a2a3b"></rect>
          <rect x="25" y="23" width="30" height="4" rx="2" fill="#cdbfcd"></rect>
          <circle cx="15" cy="40" r="6" fill="#3fb6d8"></circle>
          <rect x="25" y="35" width="34" height="4" rx="2" fill="#3a2a3b"></rect>
          <rect x="25" y="43" width="42" height="4" rx="2" fill="#cdbfcd"></rect>
          <circle cx="15" cy="60" r="6" fill="#d6294f"></circle>
          <rect x="25" y="55" width="28" height="4" rx="2" fill="#3a2a3b"></rect>
          <rect x="25" y="63" width="36" height="4" rx="2" fill="#cdbfcd"></rect>
        </svg>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;min-width:0">
        <div style="font-size:15px;color:#6b6b6b;letter-spacing:.02em">CHANNEL · AI AGENT</div>
        <div style="font-size:21px;font-weight:700;letter-spacing:-.02em;white-space:nowrap">#noble-agent-content</div>
      </div>
    </div>
  </div>

  <div class="sm-status sm-m" style="position:absolute;left:974px;top:592px">
    <div class="sm-par3 sm-m" style="width:300px;box-sizing:border-box;padding:16px 20px 18px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.12);display:flex;flex-direction:column;gap:8px">
      <div style="font-size:16px;color:#6b6b6b;letter-spacing:.02em">AI AGENTS ·</div>
      <div class="sm-word sm-m" style="display:flex;align-items:baseline;gap:8px;white-space:nowrap">
        <span style="font-size:30px;font-weight:800">5</span>
        <span style="font-size:15px;font-weight:600;color:#6b6b6b">channels in Slack</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span class="sm-k0 sm-m" style="display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:12px;background:#f3eaf3;color:#4a154b;font-size:12.5px;font-weight:600">analytics</span>
        <span class="sm-k1 sm-m" style="display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:12px;background:#f3eaf3;color:#4a154b;font-size:12.5px;font-weight:600">content</span>
        <span class="sm-k2 sm-m" style="display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:12px;background:#f3eaf3;color:#4a154b;font-size:12.5px;font-weight:600">engagement</span>
        <span class="sm-k3 sm-m" style="display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:12px;background:#f3eaf3;color:#4a154b;font-size:12.5px;font-weight:600">publisher</span>
        <span class="sm-k4 sm-m" style="display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:12px;background:#f3eaf3;color:#4a154b;font-size:12.5px;font-weight:600">strategist</span>
      </div>
    </div>
  </div>
</div>
`;

export function SmmFactoryCover({ src, alt, sizes }: Props) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover sm-cover-fallback"
      />
      <div className="sm-cover-wrap" aria-label={alt}>
        <div
          className="sm-cover-scene"
          dangerouslySetInnerHTML={{ __html: SCENE_HTML }}
        />
      </div>
    </>
  );
}

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
};

const SCENE_HTML = `
<div class="nb-dots nb-m" style="position:absolute;inset:0"></div>

<svg width="1312" height="816" viewBox="0 0 1312 816" fill="none" style="position:absolute;inset:0;pointer-events:none">
  <circle class="nb-arc nb-m" cx="0" cy="920" r="622" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
  <circle class="nb-arc nb-arc2 nb-m" cx="0" cy="920" r="532" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
</svg>

<div class="nb-scene nb-m" style="position:absolute;inset:0">
  <div class="nb-win nb-m" style="position:absolute;left:362px;top:92px;width:1200px;height:640px">
    <div style="position:relative;width:100%;height:100%;transform:scale(.88);transform-origin:0 50%">
      <div style="position:relative;width:100%;height:100%;border-radius:13px;overflow:hidden;background:#0f0d0a;box-shadow:0 0 0 1px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 90px rgba(28,22,10,.30), 0 10px 30px rgba(0,0,0,.18)">
        <div style="position:relative;height:52px;display:flex;align-items:center;gap:16px;padding:0 16px 0 18px;box-sizing:border-box;background:linear-gradient(180deg, #33312f, #2a2927);border-bottom:1px solid #0a0a0a">
          <span style="display:inline-flex;gap:8px">
            <span style="width:12px;height:12px;border-radius:50%;background:#ff5f57;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.25)"></span>
            <span style="width:12px;height:12px;border-radius:50%;background:#febc2e;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.25)"></span>
            <span style="width:12px;height:12px;border-radius:50%;background:#28c840;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.25)"></span>
          </span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#a7a5a2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="M9 5v14"></path></svg>
          <span style="display:inline-flex;gap:14px">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a7a5a2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"></path></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a7a5a2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"></path></svg>
          </span>
          <span style="flex:1"></span>
          <div style="width:420px;height:30px;border-radius:8px;background:#3d3b39;display:flex;align-items:center;justify-content:center;gap:8px;font-family:-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;font-size:13px;color:#e8e6e3">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a7a5a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>Noble
          </div>
          <span style="flex:1"></span>
          <span style="display:inline-flex;gap:18px">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a7a5a2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"></path><path d="M6 11v9h12v-9"></path></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a7a5a2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a7a5a2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"></rect><rect x="13" y="4" width="7" height="7" rx="1.5"></rect><rect x="4" y="13" width="7" height="7" rx="1.5"></rect><rect x="13" y="13" width="7" height="7" rx="1.5"></rect></svg>
          </span>
        </div>
        <div style="position:relative;height:588px;overflow:hidden">
          <div style="position:absolute;left:0;top:0;width:1002px;height:640px;transform:scale(1.1778);transform-origin:0 0;background:#0f0d0a;font-family:-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;color:#f3efe6">
            <div style="height:42px;display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid #241f18;box-sizing:border-box">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"><circle cx="5.5" cy="7" r="3"></circle><circle cx="5.5" cy="17" r="3"></circle><path d="M8 8.5 21 16M8 15.5 21 8"></path></svg>
              <span style="font-family:'Cormorant Garamond', Georgia, serif;font-size:14.5px;font-weight:500;color:#C9A84C">Noble</span>
              <span style="color:#4a4438;font-size:10px">|</span>
              <span style="font-size:9.5px;color:#b8b1a3">chop-chop</span>
              <span style="flex:1"></span>
              <span style="font-size:8px;color:#d8bd6a;padding:3px 6px;border:1px solid #6b5a2c;border-radius:3px;background:#1d1910">Starter Plan</span>
              <span style="width:22px;height:22px;border-radius:50%;background:#34495c;display:inline-flex;align-items:center;justify-content:center;font-size:7.5px;font-weight:600;color:#e7eef5;margin-left:6px">YK</span>
              <span style="display:inline-flex;flex-direction:column;line-height:1.25">
                <span style="font-size:9.5px;color:#f3efe6">Yuliia Kulinich</span>
                <span style="font-size:7px;color:#C9A84C">Manager</span>
              </span>
              <span style="display:inline-flex;align-items:center;gap:2px;padding:2px;border-radius:12px;border:1px solid #3a352c;background:#15130f;margin-left:6px">
                <span style="width:24px;height:18px;border-radius:9px;background:#C9A84C;color:#1a160d;font-size:7.5px;font-weight:700;display:inline-flex;align-items:center;justify-content:center">EN</span>
                <span style="width:22px;text-align:center;font-size:7.5px;font-weight:600;color:#9a9385">ES</span>
              </span>
              <span style="font-size:9.5px;color:#8d877b;margin-left:6px">Sign out</span>
            </div>
            <div class="nb-c0 nb-m" style="position:absolute;left:162px;top:64px;display:flex;gap:2px;padding:3px;border-radius:7px;background:#1b1813;font-size:9.5px">
              <span style="padding:6px 11px;border-radius:5px;background:#C9A84C;color:#1a160d">Overview</span>
              <span style="padding:6px 12px;color:#b9b2a3">Calendar</span>
              <span style="padding:6px 12px;color:#b9b2a3">Staff</span>
              <span style="padding:6px 12px;color:#b9b2a3">Services</span>
              <span style="padding:6px 12px;color:#b9b2a3">Settings</span>
            </div>
            <div class="nb-c1 nb-m" style="position:absolute;left:162px;top:117px;width:678px;height:225px;box-sizing:border-box;padding:18px 17px;border-radius:9px;background:#15130f;border:1px solid #2c2820">
              <div style="display:flex;justify-content:space-between;align-items:baseline">
                <span style="font-size:11px;font-weight:700">Get started</span>
                <span style="font-size:9.5px;font-weight:700;color:#C9A84C">67%</span>
              </div>
              <div style="margin-top:5px;font-size:8px;color:#9a9385">2 of 3 steps completed</div>
              <div style="margin-top:13px;height:4px;border-radius:2px;background:#34302a;overflow:hidden">
                <div class="nb-fill nb-m" style="width:67%;height:100%;border-radius:2px;background:#C9A84C"></div>
              </div>
              <div style="margin-top:22px;display:flex;align-items:center;gap:12px;padding-left:10px">
                <span class="nb-k0 nb-m" style="width:19px;height:19px;border-radius:50%;background:#7d6a35;display:inline-flex;align-items:center;justify-content:center;flex:none">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a160d" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"></path></svg>
                </span>
                <span style="font-size:9.5px;color:#6f695e;text-decoration:line-through">Add your first service</span>
              </div>
              <div style="margin-top:25px;display:flex;align-items:center;gap:12px;padding-left:10px">
                <span class="nb-k1 nb-m" style="width:19px;height:19px;border-radius:50%;background:#7d6a35;display:inline-flex;align-items:center;justify-content:center;flex:none">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a160d" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"></path></svg>
                </span>
                <span style="font-size:9.5px;color:#6f695e;text-decoration:line-through">Add a staff member</span>
              </div>
              <div style="margin-top:17px;height:43px;display:flex;align-items:center;gap:12px;padding:0 11px 0 10px;border-radius:7px;background:#22201b">
                <span style="width:17px;height:17px;flex:none;border-radius:50%;border:1.5px solid #6f695e;display:inline-flex;align-items:center;justify-content:center;font-size:7.5px;color:#9a9385">3</span>
                <div style="flex:1;display:flex;flex-direction:column;gap:3px">
                  <span style="font-size:9.5px">Share your booking link</span>
                  <span style="font-size:8px;color:#8d877b">Copy and send to your clients</span>
                </div>
                <span style="padding:5px 8px;border-radius:5px;background:#C9A84C;color:#1a160d;font-size:8px;font-weight:700">Copy link →</span>
              </div>
            </div>
            <div style="position:absolute;left:162px;top:359px;width:678px;display:flex;gap:12px">
              <div class="nb-c2 nb-m" style="flex:1;height:54px;box-sizing:border-box;padding:11px 12px;border-radius:8px;background:#15130f;border:1px solid #2c2820"><div style="font-size:8px;color:#9a9385">Staff members</div><div style="margin-top:7px;font-size:11px;font-weight:700;color:#f3efe6">5</div></div>
              <div class="nb-c3 nb-m" style="flex:1;height:54px;box-sizing:border-box;padding:11px 12px;border-radius:8px;background:#15130f;border:1px solid #2c2820"><div style="font-size:8px;color:#9a9385">Services</div><div style="margin-top:7px;font-size:11px;font-weight:700;color:#f3efe6">4</div></div>
              <div class="nb-c4 nb-m" style="flex:1;height:54px;box-sizing:border-box;padding:11px 12px;border-radius:8px;background:#15130f;border:1px solid #2c2820"><div style="font-size:8px;color:#9a9385">Status</div><div style="margin-top:7px;font-size:11px;font-weight:700;color:#f3efe6">Canceled</div></div>
              <div class="nb-c5 nb-m" style="flex:1;height:54px;box-sizing:border-box;padding:11px 12px;border-radius:8px;background:#15130f;border:1px solid #2c2820"><div style="font-size:8px;color:#9a9385">Trial days left</div><div style="margin-top:7px;font-size:11px;font-weight:700;color:#f3efe6">0</div></div>
            </div>
            <div class="nb-c6 nb-m" style="position:absolute;left:162px;top:430px;width:678px;height:136px;box-sizing:border-box;border-radius:9px;background:#15130f;border:1px solid #2c2820">
              <div style="height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border-bottom:1px solid #2c2820">
                <div style="display:flex;flex-direction:column;gap:4px">
                  <span style="font-size:11px;font-weight:700">Bookings</span>
                  <span style="font-size:8px;color:#9a9385">No bookings today</span>
                </div>
                <span style="display:inline-flex;border-radius:5px;border:1px solid #3a352c;overflow:hidden;font-size:8px">
                  <span style="padding:5px 8px;background:#C9A84C;color:#1a160d">Upcoming</span>
                  <span style="padding:5px 8px;color:#9a9385">Recent</span>
                </span>
              </div>
              <div style="text-align:center;padding-top:28px">
                <div style="font-size:9.5px;color:#8a8478">No upcoming bookings</div>
                <div style="margin-top:5px;font-size:7.5px;color:#5d584f">Bookings will appear here when clients book online</div>
              </div>
            </div>
            <div class="nb-c7 nb-m" style="position:absolute;left:162px;top:583px;width:678px;height:60px;box-sizing:border-box;display:flex;align-items:center;gap:12px;padding:0 17px;border-radius:9px;background:#15130f;border:1px solid #2c2820">
              <span style="width:27px;height:27px;border-radius:6px;background:#22201b;display:inline-flex;align-items:center;justify-content:center">
                <svg width="12" height="12" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="9" fill="#3b82f6"></rect><rect x="10" y="6" width="4" height="15" fill="#ef4444"></rect><rect x="17" y="9" width="4" height="12" fill="#22c55e"></rect></svg>
              </span>
              <div style="flex:1;display:flex;flex-direction:column;gap:3px">
                <span style="font-size:9.5px;font-weight:700">Advanced analytics</span>
                <span style="font-size:8px;color:#8d877b">Capacity, revenue &amp; staff utilization — Pro feature</span>
              </div>
              <span style="padding:6px 11px;border-radius:6px;background:#C9A84C;color:#1a160d;font-size:8px;font-weight:700">Upgrade →</span>
            </div>
            <div style="position:absolute;right:17px;top:582px;display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:13px;border:1px solid #3a352c;background:#15130f;font-size:9.5px;color:#f3efe6">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f3efe6" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"></path></svg>Feedback
            </div>
          </div>
        </div>
        <div style="position:absolute;inset:0;border-radius:13px;pointer-events:none;background:linear-gradient(118deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,0) 30%)"></div>
      </div>
    </div>
  </div>

  <div class="nb-pill nb-m" style="position:absolute;left:150px;top:160px">
    <div class="nb-par1 nb-m" style="display:flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;background:#1f1f20;color:#fff;font-size:21px;font-weight:500;letter-spacing:-.01em;box-shadow:0 10px 24px rgba(0,0,0,.18);white-space:nowrap">
      <span style="width:9px;height:9px;border-radius:50%;background:#C9A84C"></span>Noble · salon booking
    </div>
  </div>

  <div class="nb-lesson nb-m" style="position:absolute;left:962px;top:268px">
    <div class="nb-par2 nb-m" style="display:flex;align-items:center;gap:20px;width:326px;height:108px;box-sizing:border-box;padding:14px 18px 14px 14px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.14)">
      <div style="flex:none;width:78px;height:78px">
        <svg width="78" height="78" viewBox="0 0 78 78" fill="none">
          <rect x=".5" y=".5" width="77" height="77" rx="10" fill="#faf7ef" stroke="#ece5d3"></rect>
          <circle cx="39" cy="39" r="28" stroke="#eee6d2" stroke-width="7"></circle>
          <circle class="nb-ringarc nb-m" cx="39" cy="39" r="28" stroke="#C9A84C" stroke-width="7" stroke-linecap="round" stroke-dasharray="176" stroke-dashoffset="58" transform="rotate(-90 39 39)"></circle>
          <text x="39" y="44" text-anchor="middle" font-family="Manrope, sans-serif" font-size="14" font-weight="800" fill="#1a160d">67%</text>
        </svg>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="font-size:15px;color:#6b6b6b;letter-spacing:.02em">GET STARTED</div>
        <div style="font-size:26px;font-weight:600;letter-spacing:-.02em">2 of 3 steps</div>
      </div>
    </div>
  </div>

  <div class="nb-status nb-m" style="position:absolute;left:140px;top:664px">
    <div class="nb-par3 nb-m" style="width:290px;box-sizing:border-box;padding:16px 20px 18px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.14);display:flex;flex-direction:column;gap:10px">
      <div style="font-size:16px;color:#6b6b6b;letter-spacing:.02em">CHOP-CHOP ·</div>
      <div class="nb-word nb-m" style="display:flex;align-items:baseline;gap:22px;white-space:nowrap">
        <span style="display:inline-flex;align-items:baseline;gap:6px"><span style="font-size:30px;font-weight:800">5</span><span style="font-size:15px;font-weight:600;color:#6b6b6b">staff</span></span>
        <span style="display:inline-flex;align-items:baseline;gap:6px"><span style="font-size:30px;font-weight:800">4</span><span style="font-size:15px;font-weight:600;color:#6b6b6b">services</span></span>
      </div>
      <div style="height:4px;border-radius:2px;background:#C9A84C"></div>
    </div>
  </div>
</div>
`;

export function NobleCover({ src, alt, sizes }: Props) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover nb-cover-fallback"
      />
      <div className="nb-cover-wrap" aria-label={alt}>
        <div
          className="nb-cover-scene"
          dangerouslySetInnerHTML={{ __html: SCENE_HTML }}
        />
      </div>
    </>
  );
}

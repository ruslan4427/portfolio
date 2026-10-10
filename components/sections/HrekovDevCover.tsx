import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
};

const SCENE_HTML = `
<div class="hd-dots hd-m" style="position:absolute;inset:0"></div>

<svg width="1312" height="816" viewBox="0 0 1312 816" fill="none" style="position:absolute;inset:0;pointer-events:none">
  <circle class="hd-arc hd-m" cx="0" cy="920" r="622" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
  <circle class="hd-arc hd-arc2 hd-m" cx="0" cy="920" r="532" stroke="#d6d6d1" stroke-width="1.2" transform="rotate(-90 0 920)"></circle>
</svg>

<div class="hd-scene hd-m" style="position:absolute;inset:0">
  <div class="hd-win hd-m" style="position:absolute;left:128px;top:80px;width:1200px;height:680px">
    <div style="position:relative;width:100%;height:100%;transform:scale(.88);transform-origin:0 50%">
      <div style="position:absolute;inset:0;border-radius:13px;box-shadow:0 40px 90px rgba(40,34,24,.22), 0 10px 30px rgba(0,0,0,.10)"></div>
      <div style="position:relative;width:100%;height:100%;border-radius:13px;overflow:hidden;background:#f3f1ec;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)">
        <div style="position:relative;height:52px;display:flex;align-items:center;gap:16px;padding:0 16px 0 18px;box-sizing:border-box;background:linear-gradient(180deg, #f8f7f5, #eeede9);border-bottom:1px solid #dad8d2">
          <span style="display:inline-flex;gap:8px">
            <span style="width:12px;height:12px;border-radius:50%;background:#ff5f57;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.18)"></span>
            <span style="width:12px;height:12px;border-radius:50%;background:#febc2e;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.18)"></span>
            <span style="width:12px;height:12px;border-radius:50%;background:#28c840;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.18)"></span>
          </span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8a8884" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="M9 5v14"></path></svg>
          <span style="display:inline-flex;gap:14px">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8884" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"></path></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8884" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"></path></svg>
          </span>
          <span style="flex:1"></span>
          <div style="position:relative;overflow:hidden;width:420px;height:30px;border-radius:8px;background:#e3e1dc;display:flex;align-items:center;justify-content:center;gap:8px;font-family:-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;font-size:13px;color:#3a3a3a">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a8884" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
            <span class="hd-atitle hd-m">Ruslan Hrekov</span>
            <span class="hd-load hd-m" style="position:absolute;left:6px;right:6px;bottom:0;height:2px;border-radius:1px;background:#0a84ff"></span>
          </div>
          <span style="flex:1"></span>
          <span style="display:inline-flex;gap:18px">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8884" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"></path><path d="M6 11v9h12v-9"></path></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8884" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8884" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"></rect><rect x="13" y="4" width="7" height="7" rx="1.5"></rect><rect x="4" y="13" width="7" height="7" rx="1.5"></rect><rect x="13" y="13" width="7" height="7" rx="1.5"></rect></svg>
          </span>
        </div>
        <div style="position:relative;height:628px;overflow:hidden">
          <div style="position:absolute;left:0;top:0;width:1200px;height:628px;background-color:#f3f1ec;font-family:Inter, -apple-system, 'Helvetica Neue', Arial, sans-serif;color:#141414">
            <div class="hd-pagebg hd-m" style="position:absolute;inset:0;background-image:radial-gradient(circle, #e3e0d9 1px, transparent 1.3px);background-size:20px 20px"></div>
            <div class="hd-nv hd-m" style="position:absolute;left:626px;top:14px;display:flex">
              <span class="hd-hl hd-m" style="position:absolute;left:0;top:0;width:52px;height:22px;border-radius:11px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.07)"></span>
              <span class="hd-navHome hd-m" style="position:relative;width:52px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;color:#111">Home</span>
              <span class="hd-navCases hd-m" style="position:relative;width:56px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;color:#6b6b6b">Cases</span>
              <span style="position:relative;width:64px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;color:#6b6b6b">Journal</span>
              <span style="position:relative;width:54px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;color:#6b6b6b">About</span>
              <span style="position:relative;width:66px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;color:#6b6b6b">Services</span>
              <span style="position:relative;width:62px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;color:#6b6b6b">Contact</span>
            </div>
            <div class="hd-dt hd-m" style="position:absolute;left:183px;top:76px;font-size:9.5px;line-height:13px;color:#6e6e6e;letter-spacing:.02em;font-variant-numeric:tabular-nums">
              <div>Oct 3, 2026</div>
              <div style="display:flex">11:48:<span style="display:inline-block;height:13px;overflow:hidden"><span class="hd-clock hd-m" style="display:flex;flex-direction:column"><span style="height:13px">20</span><span style="height:13px">21</span><span style="height:13px">22</span><span style="height:13px">23</span><span style="height:13px">24</span><span style="height:13px">25</span><span style="height:13px">26</span><span style="height:13px">27</span><span style="height:13px">28</span><span style="height:13px">29</span></span></span>&nbsp;PM</div>
            </div>
            <div class="hd-av hd-m" style="position:absolute;left:183px;top:180px;width:89px;height:89px;border-radius:50%;overflow:hidden;box-shadow:0 6px 16px rgba(0,0,0,.16)">
              <img src="/case-studies/hrekov-dev/avatar.jpg" alt="Ruslan Hrekov" style="width:104%;height:104%;margin:-2%;object-fit:cover;display:block">
            </div>
            <div style="position:absolute;left:180px;top:288px;font-family:'Playfair Display', Georgia, serif;font-weight:500;font-size:76px;line-height:90px;letter-spacing:-.01em;color:#141414">
              <div style="height:106px;overflow:hidden;display:flex;gap:20px">
                <span class="hd-w0 hd-m" style="display:inline-block">Software,</span>
                <span class="hd-w1 hd-m" style="display:inline-block">shipped</span>
              </div>
              <div style="height:106px;margin-top:-16px;overflow:hidden">
                <span class="hd-w2 hd-m" style="display:inline-block">honestly.</span>
              </div>
            </div>
            <div style="position:absolute;left:183px;top:531px;display:flex;gap:10px">
              <span class="hd-s0 hd-m" style="width:29px;height:29px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.08), 0 0 0 .5px rgba(0,0,0,.04);display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:500;color:#111">GH</span>
              <span class="hd-s1 hd-m" style="width:29px;height:29px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.08), 0 0 0 .5px rgba(0,0,0,.04);display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:500;color:#111">X</span>
              <span class="hd-s2 hd-m" style="width:29px;height:29px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.08), 0 0 0 .5px rgba(0,0,0,.04);display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:500;color:#111">IN</span>
              <span class="hd-s3 hd-m" style="width:29px;height:29px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.08), 0 0 0 .5px rgba(0,0,0,.04);display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:500;color:#111">@</span>
            </div>
            <div class="hd-pg hd-m" style="position:absolute;left:622px;top:516px;width:314px;font-size:11px;line-height:18px;color:#3b3b3b">I&rsquo;m Ruslan Hrekov, a solo builder based in Kharkiv &rarr; Maryland &rarr; Houston. I collaborate with Claude to ship production software that&rsquo;s honest about how it was made &mdash; commit hashes, DEVLOGs, frozen logic.</div>
            <div class="hd-ds hd-m" style="position:absolute;left:622px;top:604px;display:flex;align-items:center;gap:6px;font-size:9.5px;color:#6b6b6b">Discover <span class="hd-disc hd-m" style="display:inline-block">&darr;</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <span class="hd-r0 hd-m" style="position:absolute;left:310px;top:346px;width:36px;height:36px;border-radius:50%;background:rgba(20,20,20,.25);pointer-events:none"></span>
  <span class="hd-r1 hd-m" style="position:absolute;left:731px;top:171px;width:36px;height:36px;border-radius:50%;background:rgba(20,20,20,.25);pointer-events:none"></span>
  <span class="hd-r2 hd-m" style="position:absolute;left:682px;top:687px;width:36px;height:36px;border-radius:50%;background:rgba(20,20,20,.25);pointer-events:none"></span>

  <div class="hd-wg0 hd-m" style="position:absolute;left:112px;top:170px;transform-origin:100% 100%">
    <div class="hd-par1 hd-m" style="display:flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;background:#1f1f20;color:#fff;font-size:21px;font-weight:500;letter-spacing:-.01em;box-shadow:0 10px 24px rgba(0,0,0,.18);white-space:nowrap">
      <span style="width:9px;height:9px;border-radius:50%;background:#d9622b"></span>Ruslan Hrekov &middot; solo builder
    </div>
  </div>

  <div class="hd-wg1 hd-m" style="position:absolute;left:930px;top:238px;transform-origin:30% 0%">
    <div class="hd-par2 hd-m" style="width:330px;box-sizing:border-box;padding:16px 20px 18px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.14);display:flex;flex-direction:column;gap:10px">
      <div style="font-size:16px;color:#6b6b6b;letter-spacing:.02em">EXPLORE &middot;</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span style="display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border-radius:14px;background:#141414;color:#fff;font-size:13.5px;font-weight:600">Cases &rarr;</span>
        <span style="display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border-radius:14px;background:#f1eee7;color:#141414;font-size:13.5px;font-weight:600">Journal</span>
        <span style="display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border-radius:14px;background:#f1eee7;color:#141414;font-size:13.5px;font-weight:600">Services</span>
        <span style="display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border-radius:14px;background:#f1eee7;color:#141414;font-size:13.5px;font-weight:600">About</span>
      </div>
    </div>
  </div>

  <div class="hd-wg2 hd-m" style="position:absolute;left:96px;top:640px;transform-origin:100% 60%">
    <div class="hd-par3 hd-m" style="width:318px;box-sizing:border-box;padding:16px 20px 18px;border-radius:16px;background:#fff;box-shadow:0 18px 40px rgba(20,20,20,.14);display:flex;flex-direction:column;gap:10px">
      <div style="font-size:16px;color:#6b6b6b;letter-spacing:.02em">SHIPPED HONESTLY &middot;</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span style="display:inline-flex;align-items:center;height:26px;padding:0 11px;border-radius:13px;background:#f1eee7;color:#141414;font-size:13px;font-weight:600">commit hashes</span>
        <span style="display:inline-flex;align-items:center;height:26px;padding:0 11px;border-radius:13px;background:#f1eee7;color:#141414;font-size:13px;font-weight:600">DEVLOGs</span>
        <span style="display:inline-flex;align-items:center;height:26px;padding:0 11px;border-radius:13px;background:#f1eee7;color:#141414;font-size:13px;font-weight:600">frozen logic</span>
      </div>
    </div>
  </div>

  <div class="hd-cursor hd-m" style="position:absolute;left:0;top:0;width:22px;height:30px;pointer-events:none">
    <div class="hd-press hd-m" style="width:22px;height:30px">
      <svg width="22" height="30" viewBox="0 0 22 30" fill="none"><path d="M2 2v22l6-5.5 4 9 3.6-1.6-4-8.8H20z" fill="#111" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"></path></svg>
    </div>
  </div>
</div>
`;

export function HrekovDevCover({ src, alt, sizes }: Props) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover hd-cover-fallback"
      />
      <div className="hd-cover-wrap" aria-label={alt}>
        <div
          className="hd-cover-scene"
          dangerouslySetInnerHTML={{ __html: SCENE_HTML }}
        />
      </div>
    </>
  );
}

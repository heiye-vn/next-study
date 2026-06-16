import { Instrument_Serif, IBM_Plex_Sans } from 'next/font/google';
import GuideToc from './GuideToc';
import GuideContent from './guide.mdx';
import BackToTop from './BackToTop';

const serif = Instrument_Serif({ weight: '400', subsets: ['latin'] });
const body = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
});

export default function GuidePage() {
  return (
    <div className={`${body.className} min-h-screen bg-[#faf9f6] text-stone-800`}>
      {/* Top accent bar */}
      <div className="h-0.5 bg-linear-to-r from-amber-500 via-amber-400 to-transparent" />

      <div className="mx-auto flex max-w-345">
        {/* ── Sidebar ── */}
        <aside className="hidden w-67.5 shrink-0 lg:block">
          <div className="sticky top-0">
            <div className="px-8 pt-12 pb-6">
              <span className="font-mono text-[11px] tracking-wider text-stone-400 uppercase">
                Next.js 16.2.9
              </span>
            </div>
            <GuideToc />
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="max-w-205 min-w-0 flex-1 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          {/* ── Header ── */}
          <header className="mb-20">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-12 bg-amber-500" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-stone-400 uppercase">
                Configuration Guide
              </span>
            </div>
            <h1
              className={`${serif.className} mb-6 text-[clamp(42px,5vw,62px)] leading-[1.08] tracking-tight text-stone-900`}
            >
              Next.js 配置指南
            </h1>
            <p className="max-w-135 text-[19px] leading-relaxed font-light text-stone-500">
              next.config.js/ts 全景解析 — 深度整合最新版规范，
              为您提供一份详尽、现代且具备向后兼容性的配置参考。
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 font-mono text-[12px] text-stone-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                v16.2.9
              </span>
              <span className="text-[12px] text-stone-400">全面对接最新规范 · 向后兼容</span>
            </div>
          </header>

          <GuideContent />

          {/* ── Footer ── */}
          <footer className="mt-24 border-t border-stone-200 pt-8 text-center">
            <p className="font-mono text-[12px] text-stone-400">
              Next.js 16.2.9 Configuration Guide &middot; Built with Next.js + Tailwind CSS
            </p>
          </footer>
        </main>
      </div>
      <BackToTop />
    </div>
  );
}

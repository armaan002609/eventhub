'use client';

export default function FullscreenButton() {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <button 
        onClick={toggleFullscreen}
        className="text-xs font-bold uppercase tracking-widest text-[#554093] hover:text-[#554093]/70 bg-white shadow-sm px-4 py-2 rounded-full border border-[#554093]/10 flex items-center gap-2 transition-all hover:scale-105"
        title="Toggle Fullscreen"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
        Fullscreen
      </button>
    </div>
  );
}

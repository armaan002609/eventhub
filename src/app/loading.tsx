export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full min-h-[80vh]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#554093]/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#554093] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-[#554093]/60 font-semibold text-sm tracking-widest uppercase">Loading...</p>
    </div>
  );
}

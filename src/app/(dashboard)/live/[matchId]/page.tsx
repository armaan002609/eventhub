import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import LiveMatchView from "./LiveMatchView";

export default async function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = await params;
  const match = await prisma.match.findUnique({
    where: { id: resolvedParams.matchId }
  });

  if (!match) {
    notFound();
  }

  // Parse JSON data, provide fallback for empty
  const initialData = typeof match.scoreData === 'object' && match.scoreData !== null 
    ? match.scoreData 
    : {};

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#554093] tracking-tight">{match.title}</h1>
          <p className="text-[#554093]/60 font-medium mt-1 uppercase tracking-wider text-xs font-bold">{match.sport} • {match.status}</p>
        </div>
        
        <Link
          href={`/fullscreen/${match.id}`}
          className="text-xs font-bold uppercase tracking-widest text-[#554093] hover:bg-[#554093]/10 px-4 py-2 rounded-full border border-[#554093]/20 flex items-center gap-2 transition-all"
          target="_blank"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
          Fullscreen Mode
        </Link>
      </div>
      
      {/* Client Component that handles Realtime Subscriptions and Rendering */}
      <LiveMatchView 
        matchId={match.id} 
        sport={match.sport} 
        initialData={initialData} 
        status={match.status} 
      />
    </div>
  );
}

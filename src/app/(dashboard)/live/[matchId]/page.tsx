import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LiveMatchView from "./LiveMatchView";

export default async function MatchDetailPage({ params }: { params: { matchId: string } }) {
  const match = await prisma.match.findUnique({
    where: { id: params.matchId }
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

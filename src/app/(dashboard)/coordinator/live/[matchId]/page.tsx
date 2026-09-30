import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CricketScorer from "@/components/live-score/scorer/CricketScorer";
import FootballScorer from "@/components/live-score/scorer/FootballScorer";
import BadmintonScorer from "@/components/live-score/scorer/BadmintonScorer";
import WrestlingScorer from "@/components/live-score/scorer/WrestlingScorer";
import CanoeingScorer from "@/components/live-score/scorer/CanoeingScorer";

export default async function ScorerPanelPage({ params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = await params;
  const match = await prisma.match.findUnique({
    where: { id: resolvedParams.matchId }
  });

  if (!match) notFound();

  const data = typeof match.scoreData === 'object' && match.scoreData !== null ? match.scoreData : {};

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-[#554093]/10">
        <div>
          <h1 className="text-2xl font-bold text-[#554093]">{match.title}</h1>
          <p className="text-[#554093]/60 font-medium text-xs tracking-wider uppercase mt-1">Scorer Panel • {match.sport}</p>
        </div>
        <div className="text-xs font-bold px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full uppercase">
          {match.status}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#554093]/10">
        {match.sport === 'CRICKET' && <CricketScorer matchId={match.id} initialData={data} />}
        {match.sport === 'FOOTBALL' && <FootballScorer matchId={match.id} initialData={data} />}
        {match.sport === 'BADMINTON' && <BadmintonScorer matchId={match.id} initialData={data} />}
        {match.sport === 'WRESTLING' && <WrestlingScorer matchId={match.id} initialData={data} />}
        {match.sport === 'CANOEING' && <CanoeingScorer matchId={match.id} initialData={data} />}
      </div>
    </div>
  );
}

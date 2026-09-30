import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LiveMatchView from "@/app/(dashboard)/live/[matchId]/LiveMatchView";
import FullscreenButton from "./FullscreenButton";

export default async function FullscreenScorePage({ params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = await params;
  const match = await prisma.match.findUnique({
    where: { id: resolvedParams.matchId }
  });

  if (!match) {
    notFound();
  }

  const initialData = typeof match.scoreData === 'object' && match.scoreData !== null 
    ? match.scoreData 
    : {};

  return (
    <div className="w-screen h-screen bg-[#FDFBF7] flex flex-col items-center justify-center overflow-hidden relative">
      <FullscreenButton />

      <div className="w-full max-w-7xl px-8 scale-125 transform-gpu origin-center">
        <LiveMatchView 
          matchId={match.id} 
          sport={match.sport} 
          initialData={initialData} 
        />
      </div>
    </div>
  );
}

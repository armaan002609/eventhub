import React from "react";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";
import { createClient } from "@/utils/supabase/server";

export default async function HackathonRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?callbackUrl=/events/${resolvedParams.id}/register`);
  }

  // Check if profile is complete
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (!dbUser?.username) {
    redirect('/profile/setup');
  }

  const hackathon = await prisma.hackathon.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!hackathon) {
    return notFound();
  }

  // Check if already registered (Solo or part of a Team)
  const existingSolo = await prisma.registration.findUnique({
    where: {
      userId_hackathonId: {
        userId: user.id,
        hackathonId: hackathon.id,
      }
    }
  });

  const existingTeam = await prisma.teamMember.findFirst({
    where: {
      userId: user.id,
      team: {
        hackathonId: hackathon.id
      }
    }
  });

  const isRegistered = !!existingSolo || !!existingTeam;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-8 pt-8 pb-24">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href={`/events/${hackathon.id}`} className="text-[#554093]/70 hover:text-[#554093] text-sm font-medium flex items-center gap-1">
            &larr; Back to {hackathon.title}
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#554093]">Register for {hackathon.title}</h1>
          <p className="text-[#554093]/70 font-medium text-[16px] mt-2">by {hackathon.organizer}</p>
        </div>

        {isRegistered ? (
           <div className="max-w-2xl mx-auto bg-emerald-50 rounded-3xl p-8 border border-emerald-100 text-center">
             <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
             </div>
             <h2 className="text-2xl font-bold text-emerald-800 mb-2">You're Registered!</h2>
             <p className="text-emerald-700/80 mb-6">Your application for {hackathon.title} has been submitted successfully.</p>
             <Link href="/dashboard" className="inline-block bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl shadow hover:bg-emerald-700 transition">
               Go to Dashboard
             </Link>
           </div>
        ) : (
          <RegistrationForm hackathonId={hackathon.id} />
        )}
      </main>
    </div>
  );
}

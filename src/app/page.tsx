import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';
import Navbar from '@/components/Navbar';
import LiveMatchView from '@/app/(dashboard)/live/[matchId]/LiveMatchView';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userRole = 'PARTICIPANT';
  let dashboardPath = '/participant';
  
  // Parallelize the independent DB queries to significantly improve load time
  const [dbUser, hackathons, liveMatchCount, liveMatch] = await Promise.all([
    user ? prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    }) : Promise.resolve(null),
    prisma.hackathon.findMany({
      where: { isPublished: true },
      orderBy: { startsAt: 'asc' }
    }),
    prisma.match.count({
      where: { status: 'LIVE' }
    }),
    prisma.match.findFirst({
      where: { status: 'LIVE' },
      orderBy: { updatedAt: 'desc' }
    })
  ]);

  if (dbUser?.role) {
    userRole = dbUser.role;
    if (userRole === 'SUPER_ADMIN') dashboardPath = '/super-admin';
    if (userRole === 'COORDINATOR') dashboardPath = '/coordinator';
    if (userRole === 'VOLUNTEER') dashboardPath = '/volunteer';
  }

  return (
    <>
      <Navbar />



      <main className="pt-8 pb-24 max-w-[1400px] mx-auto px-8">
        
        {liveMatch && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h2 className="text-rose-600 font-bold uppercase tracking-widest text-sm">Now Live: {liveMatch.title}</h2>
              <Link href="/live" className="ml-4 text-xs font-bold text-[#554093] hover:underline bg-[#554093]/5 px-3 py-1 rounded-full border border-[#554093]/10">View All Matches &rarr;</Link>
            </div>
            <div className="flex justify-center w-full">
              <LiveMatchView 
                matchId={liveMatch.id}
                sport={liveMatch.sport}
                status={liveMatch.status}
                hideSyncStatus={true}
                initialData={typeof liveMatch.scoreData === 'object' && liveMatch.scoreData !== null ? liveMatch.scoreData : {}}
                showCarouselDots={liveMatchCount > 1}
              />
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 flex flex-col items-center text-center overflow-hidden mb-16 rounded-3xl">
          
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full -z-10" style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(85,64,147,0.15) 0%, transparent 100%)' }}></div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#554093]/10 text-[#554093] text-[13px] font-bold mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            THE NEW STANDARD FOR HACKATHONS
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-[84px] font-bold tracking-tight leading-[1.05] mb-8 max-w-[1000px] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            You told everyone to host amazing events.<br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#554093] to-rose-500">
              Now give them a secure place to do it.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-[22px] font-medium mb-12 leading-relaxed max-w-3xl text-[#554093]/70 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            EventHub lets every team build. Organizers and Coordinators maintain complete visibility, governance, and control.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
            {user ? (
              <Link
                href={dashboardPath}
                className="group relative w-full sm:w-auto bg-[#554093] text-white rounded-full px-10 py-4 text-[14px] font-bold uppercase tracking-widest hover:bg-[#433275] transition-all shadow-xl shadow-[#554093]/20 hover:shadow-2xl hover:shadow-[#554093]/40 hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Go to Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="group relative w-full sm:w-auto bg-[#554093] text-white rounded-full px-10 py-4 text-[14px] font-bold uppercase tracking-widest hover:bg-[#433275] transition-all shadow-xl shadow-[#554093]/20 hover:shadow-2xl hover:shadow-[#554093]/40 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  GET STARTED
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-white border-2 border-[#554093]/10 text-[#554093] rounded-full px-10 py-4 text-[14px] font-bold uppercase tracking-widest hover:border-[#554093]/30 hover:bg-[#554093]/5 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 text-center"
                >
                  SIGN UP FREE
                </Link>
              </>
            )}
          </div>
        </section>


        {/* Upcoming Hackathons (Devfolio Style, Tines Themed) */}
        {hackathons.length > 0 && (
        <section className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#554093] mb-3">Hackathons & Events</h2>
              <p className="text-[#554093]/70 font-medium text-[16px]">Participate, build things, and get hired.</p>
            </div>
            
            {/* Devfolio-style Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="px-5 py-2.5 bg-[#554093] text-white rounded-full text-[13px] font-bold whitespace-nowrap shadow-md shadow-[#554093]/20 transition-transform hover:scale-105">
                All
              </button>
              <button className="px-5 py-2.5 bg-[#554093]/5 text-[#554093] rounded-full text-[13px] font-bold whitespace-nowrap hover:bg-[#554093]/10 transition-colors">
                Open
              </button>
              <button className="px-5 py-2.5 bg-[#554093]/5 text-[#554093] rounded-full text-[13px] font-bold whitespace-nowrap hover:bg-[#554093]/10 transition-colors">
                Upcoming
              </button>
              <button className="px-5 py-2.5 bg-[#554093]/5 text-[#554093] rounded-full text-[13px] font-bold whitespace-nowrap hover:bg-[#554093]/10 transition-colors">
                Past
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => {
              const startsInDays = Math.max(0, Math.ceil((hackathon.startsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              const isClosed = hackathon.endsAt < new Date();
              const badgeText = isClosed ? "Applications Closed" : (startsInDays <= 7 ? `Starts in ${startsInDays} days` : "Apply Now");
              
              return (
                <Link href={`/hackathon/${hackathon.id}`} key={hackathon.id} className="bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#554093]/10 hover:shadow-xl hover:shadow-[#554093]/5 transition-all duration-300 group cursor-pointer flex flex-col h-full relative block">
                  {/* Cover Image / Gradient */}
                  <div className={`h-32 w-full bg-gradient-to-r relative ${
                    !hackathon.imagePath ? (isClosed ? "from-rose-500 to-orange-400" : (startsInDays <= 7 ? "from-[#554093] to-[#7B61C8]" : "from-emerald-500 to-teal-400")) : ""
                  }`}
                  style={hackathon.imagePath ? { backgroundImage: `url(${hackathon.imagePath})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  >
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                      {badgeText}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                      {hackathon.eventType}
                    </div>
                  </div>
                  
                  {/* Logo (Overlapping) */}
                  <div className="px-5 relative">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-md border border-[#554093]/10 flex items-center justify-center -mt-7 mb-3 p-1">
                      {hackathon.logoPath ? (
                        <img src={hackathon.logoPath} alt={`${hackathon.organizer} logo`} className="w-full h-full object-contain rounded-lg block" />
                      ) : (
                        <div className={`w-full h-full rounded-lg bg-gradient-to-br ${isClosed ? "from-rose-400 to-orange-400" : "from-indigo-500 to-purple-400"}`}></div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-5 flex flex-col flex-1">
                    <h3 className="text-[17px] font-bold text-[#554093] group-hover:text-[#3B2C66] transition-colors line-clamp-1">{hackathon.title}</h3>
                    <p className="text-[13px] text-[#554093]/60 font-medium mt-1">by {hackathon.organizer}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="bg-[#554093]/5 text-[#554093] text-[11px] font-bold px-2.5 py-1 rounded-md">{hackathon.location}</span>
                      {hackathon.themes.map((theme, i) => (
                        <span key={i} className="bg-[#554093]/5 text-[#554093] text-[11px] font-bold px-2.5 py-1 rounded-md">{theme}</span>
                      ))}
                      {hackathon.prizeText && (
                        <span className="bg-[#554093]/5 text-[#554093] text-[11px] font-bold px-2.5 py-1 rounded-md">{hackathon.prizeText}</span>
                      )}
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#554093]/60">
                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {hackathon.startsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {hackathon.endsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {hackathon.participants > 0 && (
                             <span className="text-[11px] font-bold text-[#554093]/60">{hackathon.participants.toLocaleString()} Builders</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        )}

      </main>
    </>
  );
}

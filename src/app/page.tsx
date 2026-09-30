import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userRole = 'PARTICIPANT';
  let dashboardPath = '/participant';
  
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });
    if (dbUser?.role) {
      userRole = dbUser.role;
      if (userRole === 'SUPER_ADMIN') dashboardPath = '/super-admin';
      if (userRole === 'COORDINATOR') dashboardPath = '/coordinator';
      if (userRole === 'VOLUNTEER') dashboardPath = '/volunteer';
    }
  }

  const hackathons = await prisma.hackathon.findMany({
    where: { isPublished: true },
    orderBy: { startsAt: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#F6F4F0] font-sans text-[#554093] selection:bg-[#554093]/20">
      


      {/* Main Navbar */}
      <header className="flex justify-between items-center py-5 px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border-[3px] border-[#554093] flex flex-col justify-center items-center gap-0.5">
               <div className="w-4 h-[2px] bg-[#554093]"></div>
               <div className="w-4 h-[2px] bg-[#554093]"></div>
               <div className="w-4 h-[2px] bg-[#554093]"></div>
            </div>
            <span className="font-bold text-2xl tracking-tight">eventhub</span>
          </Link>
          
          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#554093]">
            <Link href="/events" className="hover:opacity-70 transition-opacity">Events</Link>
            <Link href="/hackathon" className="hover:opacity-70 transition-opacity">Hackathon</Link>
            <Link href="/leaderboard" className="hover:opacity-70 transition-opacity">Leaderboard</Link>
            <Link href="/about" className="hover:opacity-70 transition-opacity">About</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href={dashboardPath} className="flex items-center gap-2 font-medium text-[15px] hover:opacity-70 transition-opacity bg-[#554093]/10 px-4 py-2 rounded-full">
                <div className="w-6 h-6 rounded-full bg-[#554093] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span>Dashboard</span>
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-5 text-[#554093]">
                <Link href="/login" className="font-medium text-[15px] hover:opacity-70 transition-opacity">Log in</Link>
                <Link href="/register" className="font-medium text-[15px] hover:opacity-70 transition-opacity">Sign up</Link>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="pt-12 pb-24 max-w-[1400px] mx-auto px-8">
        
        {/* NEW Badge */}
        <div className="inline-flex items-center border border-[#554093]/20 rounded-full mb-10 overflow-hidden">
          <span className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#554093] border-r border-[#554093]/20">NEW</span>
          <span className="px-4 py-1.5 text-[14px] font-medium text-[#554093] hover:bg-[#554093]/5 transition-colors cursor-pointer flex items-center gap-2">
            Introducing EventHub 3B <span>&rarr;</span>
          </span>
        </div>

        {/* Hero Section */}
        <section className="max-w-[1000px] mb-16">
          <h1 className="text-6xl sm:text-7xl md:text-[88px] font-normal tracking-tight leading-[1.05] mb-6">
            You told everyone to host amazing events. <br/>
            Now give them a secure place to do it.
          </h1>
          
          <p className="text-xl md:text-[26px] font-light mb-12 leading-relaxed max-w-4xl text-[#554093]/90">
            EventHub lets every team build. Organizers and Coordinators maintain complete visibility, governance, and control.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {user ? (
              <Link
                href={dashboardPath}
                className="w-full sm:w-auto bg-[#554093] text-white rounded-full px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-[#433275] transition-colors text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full sm:w-auto bg-[#554093] text-white rounded-full px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-[#433275] transition-colors text-center"
                >
                  GET STARTED
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-transparent border border-[#554093]/30 text-[#554093] rounded-full px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-[#554093]/5 transition-colors text-center"
                >
                  SIGN UP FREE
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Logos Strip */}
        <section className="mb-24 overflow-hidden border-b border-[#554093]/10 pb-20">
           <div className="flex flex-wrap items-center justify-between gap-8 opacity-80">
             <div className="text-3xl font-bold font-sans tracking-tighter">coinbase</div>
             <div className="text-3xl font-normal font-sans tracking-tight flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                databricks
             </div>
             <div className="text-3xl font-black font-sans tracking-tighter">reddit</div>
             <div className="text-3xl font-bold font-serif">snowflake</div>
             <div className="text-3xl font-bold font-sans tracking-tight">intercom</div>
             <div className="text-3xl font-semibold font-sans tracking-tighter flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 6v8l-8 6-8-6V8z"/></svg>
                Dropbox
             </div>
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
                <div key={hackathon.id} className="bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#554093]/10 hover:shadow-xl hover:shadow-[#554093]/5 transition-all duration-300 group cursor-pointer flex flex-col h-full relative">
                  {/* Cover Image / Gradient */}
                  <div className={`h-32 w-full bg-gradient-to-r relative ${
                    isClosed ? "from-rose-500 to-orange-400" : (startsInDays <= 7 ? "from-[#554093] to-[#7B61C8]" : "from-emerald-500 to-teal-400")
                  }`}>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                      {badgeText}
                    </div>
                  </div>
                  
                  {/* Logo (Overlapping) */}
                  <div className="px-5 relative">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-md border border-[#554093]/10 flex items-center justify-center -mt-7 mb-3 overflow-hidden p-2">
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${isClosed ? "from-rose-400 to-orange-400" : "from-indigo-500 to-purple-400"}`}></div>
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
                </div>
              );
            })}
          </div>
        </section>
        )}

      </main>
    </div>
  );
}

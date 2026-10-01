import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pb-24">
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-8 max-w-[1000px] mx-auto text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#554093] mb-6 leading-[1.1]">
            We build the tools <br className="hidden sm:block"/> for creators.
          </h1>
          <p className="text-lg sm:text-xl text-[#554093]/70 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            EventHub was founded with a simple mission: make organizing and participating in hackathons seamless, secure, and spectacular.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-8 max-w-[1000px] mx-auto scroll-mt-20">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-3xl border border-[#554093]/10 shadow-lg shadow-[#554093]/5">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#554093] tracking-tight mb-4">Get in Touch</h2>
              <p className="text-[#554093]/70 mb-6">Whether you're looking to sponsor a hackathon, host an event on our platform, or just want to say hi, we'd love to hear from you.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-3 text-[#554093]">
                  <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="font-medium">hello@eventhub.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-[#554093]">
                  <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="font-medium">San Francisco, CA</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-5 py-4 border-2 border-[#554093]/10 bg-[#FDFBF7] placeholder-[#554093]/40 text-[#554093] rounded-xl focus:outline-none focus:border-[#554093]/30 focus:ring-0 transition-colors text-[15px]" />
                <input type="email" placeholder="Work Email" className="w-full px-5 py-4 border-2 border-[#554093]/10 bg-[#FDFBF7] placeholder-[#554093]/40 text-[#554093] rounded-xl focus:outline-none focus:border-[#554093]/30 focus:ring-0 transition-colors text-[15px]" />
                <textarea rows={4} placeholder="How can we help you?" className="w-full px-5 py-4 border-2 border-[#554093]/10 bg-[#FDFBF7] placeholder-[#554093]/40 text-[#554093] rounded-xl focus:outline-none focus:border-[#554093]/30 focus:ring-0 transition-colors text-[15px] resize-none"></textarea>
                <button type="button" className="w-full bg-[#554093] text-white rounded-xl px-8 py-4 text-[13px] font-bold uppercase tracking-widest hover:bg-[#433275] transition-colors shadow-md">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-8 bg-[#FDFBF7] border-t border-[#554093]/10 scroll-mt-20">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#554093] tracking-tight mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="bg-white p-6 rounded-2xl border border-[#554093]/10">
                <h3 className="text-lg font-bold text-[#554093] mb-2">How do I host a hackathon on EventHub?</h3>
                <p className="text-[#554093]/70 text-[15px] leading-relaxed">
                  Currently, event hosting is invite-only as we scale our infrastructure. If you're a university or enterprise looking to host, please use the contact form above to get in touch with our partnerships team.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white p-6 rounded-2xl border border-[#554093]/10">
                <h3 className="text-lg font-bold text-[#554093] mb-2">Is the platform free for participants?</h3>
                <p className="text-[#554093]/70 text-[15px] leading-relaxed">
                  Yes! EventHub is 100% free for participants. You can register, join teams, and submit projects without ever paying a dime. Some specific events may charge a venue fee, but the platform itself is free.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white p-6 rounded-2xl border border-[#554093]/10">
                <h3 className="text-lg font-bold text-[#554093] mb-2">How does the live leaderboard work?</h3>
                <p className="text-[#554093]/70 text-[15px] leading-relaxed">
                  Our leaderboards are powered by real-time websockets. When an event judge or automated scoring system updates a team's score, it instantly reflects on the public leaderboard page for everyone to see.
                </p>
              </div>
            </div>
          </div>
        </section>
        
      </main>
    </>
  );
}

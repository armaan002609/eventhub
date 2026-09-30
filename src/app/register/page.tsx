import Link from "next/link";
import React from "react";
import { signup, loginWithGoogle } from "./actions";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[440px] w-full">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[#554093] mb-12 hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M4 8h16M4 12h16M4 16h16" />
               <circle cx="12" cy="12" r="10" stroke="currentColor" />
            </svg>
            <span className="font-bold text-2xl tracking-tight">eventhub</span>
          </Link>
          <h2 className="text-[40px] leading-[1.1] font-normal tracking-tight text-[#554093]">
            Create your account
          </h2>
          <p className="mt-4 text-[17px] font-light text-[#554093]/70">
            Sign up to get started with EventHub.
          </p>
        </div>
        
        <form className="space-y-6" action={signup}>
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-[13px] font-bold tracking-widest uppercase text-[#554093] mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none block w-full px-5 py-4 border-2 border-[#554093]/20 bg-white placeholder-[#554093]/40 text-[#554093] rounded-2xl focus:outline-none focus:border-[#554093] focus:ring-0 transition-colors text-[15px]"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-[13px] font-bold tracking-widest uppercase text-[#554093] mb-2">
                Work Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-5 py-4 border-2 border-[#554093]/20 bg-white placeholder-[#554093]/40 text-[#554093] rounded-2xl focus:outline-none focus:border-[#554093] focus:ring-0 transition-colors text-[15px]"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[13px] font-bold tracking-widest uppercase text-[#554093] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-5 py-4 border-2 border-[#554093]/20 bg-white placeholder-[#554093]/40 text-[#554093] rounded-2xl focus:outline-none focus:border-[#554093] focus:ring-0 transition-colors text-[15px]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 text-[13px] font-bold uppercase tracking-[0.15em] rounded-full text-white bg-[#554093] hover:bg-[#433275] focus:outline-none transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#554093]/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#F6F5F0] text-[#554093]/50">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleAuthButton />
          </div>
        </div>
          
          <div className="text-center mt-8">
             <p className="text-[15px] text-[#554093]">
               Already have an account?{" "}
               <Link href="/login" className="font-bold underline hover:opacity-70 transition-opacity">
                 Log in
               </Link>
             </p>
          </div>
      </div>
    </div>
  );
}

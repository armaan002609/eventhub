import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TicketVerificationPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params object before accessing properties
  const resolvedParams = await params;
  const regId = resolvedParams.id;

  const registration = await prisma.registration.findUnique({
    where: { id: regId },
    include: {
      hackathon: true,
      user: {
        include: { university: true }
      },
      team: {
        include: {
          leader: {
            include: { university: true }
          }
        }
      }
    }
  });

  if (!registration) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-rose-100 text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-rose-600 mb-2">Invalid Pass</h1>
          <p className="text-[#554093]/60 font-medium mb-8">This ticket does not exist or has been deleted.</p>
          <Link href="/" className="inline-block bg-[#554093] text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-[#3B2C66] transition">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isSolo = !!registration.user;
  const participantName = isSolo ? registration.user!.name : registration.team!.leader.name;
  const university = isSolo ? registration.user!.university?.name : registration.team!.leader.university?.name;
  const teamName = isSolo ? null : registration.team!.name;

  const isPaid = registration.paymentStatus === 'PAID';
  const isVerified = isSolo ? (registration.user!.idProofStatus === 'VERIFIED') : (registration.team!.leader.idProofStatus === 'VERIFIED');

  const isValid = isPaid && isVerified;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-[#554093]/10 relative">
        
        {/* Ticket Header Pattern */}
        <div className="h-32 bg-[#554093] relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          <div className="relative z-10 text-center">
            <div className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 backdrop-blur-sm">
              Official Event Pass
            </div>
            <h1 className="text-2xl font-bold text-white px-4 leading-tight">{registration.hackathon.title}</h1>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-8 relative">
          {/* Validity Badge */}
          <div className="absolute -top-6 right-6">
            {isValid ? (
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white" title="Valid Ticket">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white" title="Action Required">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-[#554093]/40 uppercase tracking-widest mb-1">Participant</p>
              <p className="text-lg font-bold text-[#554093]">{participantName}</p>
              <p className="text-sm font-medium text-[#554093]/60">{university || 'No University Linked'}</p>
            </div>

            {teamName && (
              <div>
                <p className="text-[11px] font-bold text-[#554093]/40 uppercase tracking-widest mb-1">Team Details</p>
                <p className="text-base font-bold text-[#554093]">{teamName}</p>
                <p className="text-xs font-medium text-[#554093]/60">Leader: {participantName}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#554093]/10">
              <div>
                <p className="text-[11px] font-bold text-[#554093]/40 uppercase tracking-widest mb-1">Payment</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {registration.paymentStatus}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#554093]/40 uppercase tracking-widest mb-1">ID Proof</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {isVerified ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 text-center">
               <p className="text-[10px] font-medium text-[#554093]/40">Pass ID: {regId}</p>
               <p className="text-[10px] font-medium text-[#554093]/40 mt-1">Generated by EventHub</p>
            </div>

          </div>
        </div>

        {/* Semi-circles for ticket effect */}
        <div className="absolute top-32 -left-3 w-6 h-6 bg-[#FDFBF7] rounded-full"></div>
        <div className="absolute top-32 -right-3 w-6 h-6 bg-[#FDFBF7] rounded-full"></div>
      </div>
    </div>
  );
}

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session?.user) {
      // Sync user to Prisma database
      const user = session.user
      const dbUser = await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        },
        create: {
          id: user.id,
          email: user.email!,
          passwordHash: '', // OAuth users don't have passwords
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: 'PARTICIPANT', // Default role
        },
      })
      
      let nextPath = '/'
      const requestedNext = searchParams.get('next')
      if (requestedNext && requestedNext !== '/') {
        nextPath = requestedNext
      }

      return NextResponse.redirect(`${origin}${nextPath}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate`)
}

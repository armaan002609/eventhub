import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isDashboardRoute = path.startsWith('/participant') || 
                           path.startsWith('/volunteer') ||
                           path.startsWith('/coordinator') ||
                           path.startsWith('/super-admin');
                           
  const isAuthRoute = path === '/login' || path === '/register' || false;

  // If we have a user, grab their role from the DB
  let role = 'PARTICIPANT';
  if (user) {
    const { data: dbUser } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single()
    if (dbUser?.role) role = dbUser.role;
  }

  // 1. If logged in and on an auth page, bounce them to their specific dashboard
  if (user && isAuthRoute) {
    let target = '/participant';
    if (role === 'SUPER_ADMIN') target = '/super-admin';
    if (role === 'COORDINATOR') target = '/coordinator';
    if (role === 'VOLUNTEER') target = '/volunteer';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 2. Dashboard Protection logic
  if (isDashboardRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (path.startsWith('/super-admin') && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/participant', request.url))
    }
    if (path.startsWith('/coordinator') && role !== 'COORDINATOR' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/participant', request.url))
    }
    if (path.startsWith('/volunteer') && role !== 'VOLUNTEER' && role !== 'COORDINATOR' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/participant', request.url))
    }
  }

  return supabaseResponse
}

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
        cookies: {
            getAll() {
            return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
                request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
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

    // redirection for unauthorized users nga mo try og go sa admin endpoints except login and signup
    const protectedAdminRoutes = ['/admin/dashboard', '/admin/posts', '/admin/settings']
    const isProtectedRoute = protectedAdminRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

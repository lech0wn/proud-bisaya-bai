'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type SignupState = {
    error?: string
    }

    export async function signup(
    prevState: SignupState,
    formData: FormData
    ): Promise<SignupState> {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            get(name) {
            return cookieStore.get(name)?.value
            },
            set(name, value, options) {
            cookieStore.set({ name, value, ...options })
            },
            remove(name, options) {
            cookieStore.set({ name, value: '', ...options })
            },
        },
        }
    )

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
        data: {
            first_name: firstName,
            last_name: lastName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auth/confirm`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    redirect('/admin/login?message=Check your email to confirm your account')
}

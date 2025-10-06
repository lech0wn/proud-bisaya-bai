import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const formData = await req.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const firstName = String(formData.get('firstName'));
  const lastName = String(formData.get('lastName'));
  
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${url.origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  });

  if (error) {
    console.error('Signup error:', error.message);
    return NextResponse.redirect(
      new URL(`/signup?error=${encodeURIComponent(error.message)}`, req.url),
      { status: 303 }
    );
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    return NextResponse.redirect(
      new URL('/login?message=Check your email to confirm your account', req.url),
      { status: 303 }
    );
  }

  return NextResponse.redirect(new URL('/', req.url), {
    status: 303
  });
}
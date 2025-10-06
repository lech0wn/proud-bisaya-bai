import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Login error:', error.message);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url), {
      status: 303
    });
  }
  
  console.log('Login successful');
  return NextResponse.redirect(new URL('/', req.url), {
    status: 303
  });
}
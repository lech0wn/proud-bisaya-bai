import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const supabase = createRouteHandlerClient({ cookies });
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error.message);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error.message)}`, req.url),
      { status: 303 }
    );
  }
  
  return NextResponse.redirect(new URL('/admin/login', req.url), {
    status: 303
  });
}
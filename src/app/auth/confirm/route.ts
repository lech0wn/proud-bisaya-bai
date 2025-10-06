import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  
  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
    
    if (error) {
      console.error('Confirmation error:', error.message);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url),
        { status: 303 }
      );
    }
  }
  
  return NextResponse.redirect(new URL('/login?message=Email confirmed! Please log in.', req.url), {
    status: 303
  });
}
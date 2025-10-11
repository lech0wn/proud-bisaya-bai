import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL('/login?error=Invalid%20confirmation%20link', req.url),
      { status: 303 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as
      | 'signup'
      | 'magiclink'
      | 'recovery'
      | 'invite'
      | 'email_change'
      | 'email',
  });

  if (error) {
    console.error('[Supabase OTP Verification Error]:', error.message);
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, req.url),
      { status: 303 }
    );
  }

  return NextResponse.redirect(
    new URL('/admin/login?message=Email%20confirmed!%20Please%20log%20in.', req.url),
    { status: 303 }
  );
}

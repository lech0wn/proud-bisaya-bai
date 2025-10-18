import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;

    const { data, error } = await supabase
      .from('articles')
      .update({
        isPublished: false,
        status: 'Pending',
        updated_at: new Date().toISOString()
      })
      .eq('slug', resolvedParams.slug)
      .select()
      .single();

    if (error) {
      console.error('Unpublish error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Unpublish route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
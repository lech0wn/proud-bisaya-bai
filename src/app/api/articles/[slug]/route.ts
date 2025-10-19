import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/app/components/Categories';

//GET a published, non-archived article by slug (public)
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient();
    
    const resolvedParams = await params;
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', resolvedParams.slug)
      .eq('isPublished', true)
      .eq('isArchived', false)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
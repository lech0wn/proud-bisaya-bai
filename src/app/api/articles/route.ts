import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET all articles (public)
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('articles')
      .select('*, isEditorsPick, isBreakingNews', { count: 'exact' })
      .eq('isPublished', true)
      .eq('isArchived', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) query = query.eq('category', category);
    if (subcategory) query = query.eq('subcategory', subcategory);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      articles: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
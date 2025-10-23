import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const supabase = await createClient();

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

        const { data: article, error: articleError } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', params.slug)
            .single();

        if (articleError) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (article.isBreakingNews || article.isEditorsPick) {
            return NextResponse.json(
                { error: 'Cannot unpublish an article that is set as breaking news or editor\'s pick. Please remove those flags first.' },
                { status: 400 }
            );
        }

        const { data, error: updateError } = await supabase
            .from('articles')
            .update({
                isPublished: false,
                status: 'Pending',
                updated_at: new Date().toISOString()
            })
            .eq('slug', params.slug)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: 'Failed to unpublish article' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
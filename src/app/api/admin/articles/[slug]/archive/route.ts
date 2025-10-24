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

        // archive the article and also clear breaking news/editors pick attribute
        const { data, error } = await supabase
            .from('articles')
            .update({
                isArchived: true,
                isPublished: false,
                isBreakingNews: false,
                isEditorsPick: false,
                updated_at: new Date().toISOString()
            })
            .eq('slug', params.slug)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
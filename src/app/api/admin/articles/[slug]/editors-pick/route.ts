import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const supabase = await createClient();

        // Admin authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        // Parse request body
        const body = await request.json();
        const { isEditorsPick } = body;

        if (typeof isEditorsPick !== 'boolean') {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Get the article
        const { data: article, error: articleError } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', params.slug)
            .single();

        if (articleError || !article) {
            console.error('Article fetch error:', articleError);
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // Check if article is published
        if (!article.isPublished) {
            return NextResponse.json({
                error: 'Only published articles can be set as editor\'s pick'
            }, { status: 400 });
        }

        if (isEditorsPick) {
            // When setting as editor's pick, check limit and remove oldest if needed
            const { data: currentPicks, error: countError } = await supabase
                .from('articles')
                .select('id, slug, created_at')
                .eq('isEditorsPick', true)
                .eq('isPublished', true)
                .order('created_at', { ascending: true });

            if (countError) {
                console.error('Current picks fetch error:', countError);
                return NextResponse.json({
                    error: 'Failed to fetch current editor picks'
                }, { status: 500 });
            }

            // If we're at the limit, remove the oldest one
            if (currentPicks && currentPicks.length >= 3) {
                const oldestPick = currentPicks[0];

                // Don't remove if we're updating an existing pick
                if (oldestPick.id !== article.id) {
                    const { error: removeError } = await supabase
                        .from('articles')
                        .update({
                            isEditorsPick: false,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', oldestPick.id);

                    if (removeError) {
                        console.error('Remove oldest pick error:', removeError);
                        return NextResponse.json({
                            error: 'Failed to remove the oldest editor pick'
                        }, { status: 500 });
                    }
                }
            }

            // Set current article as editor's pick
            const { data, error: setError } = await supabase
                .from('articles')
                .update({
                    isEditorsPick: true,
                    updated_at: new Date().toISOString()
                })
                .eq('slug', params.slug)
                .select()
                .single();

            if (setError) {
                console.error('Set editor pick error:', setError);
                return NextResponse.json({
                    error: 'Failed to set editor pick'
                }, { status: 500 });
            }

            return NextResponse.json(data);
        } else {
            // When removing from editor's pick
            const { data, error: setError } = await supabase
                .from('articles')
                .update({
                    isEditorsPick: false,
                    updated_at: new Date().toISOString()
                })
                .eq('slug', params.slug)
                .select()
                .single();

            if (setError) {
                console.error('Remove editor pick error:', setError);
                return NextResponse.json({
                    error: 'Failed to update editor pick'
                }, { status: 500 });
            }

            return NextResponse.json(data);
        }
    } catch (error: any) {
        console.error('Editor pick route error:', error);
        return NextResponse.json({
            error: 'Internal Server Error: ' + error.message
        }, { status: 500 });
    }
}

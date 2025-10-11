import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';


const categories = {
  "Destinations": ["Cebu Highlights", "Beaches & Islands", "Mountain Escapes", "Heritage & History", "Hidden Gems", "Travel Itineraries"],
  "Brands and Products": ["Homegrown Brands", "Fashion & Apparel", "Tech & Gadgets", "Beauty & Wellness", "Food Products", "Eco-Friendly & Sustainable"],
  "Stories": ["Life in Cebu", "Resilience & Recovery", "Student Stories", "Entrepreneur Journeys", "Cultural Narratives", "Inspirational Profiles"],
  "News and Entertainment": ["Breaking News Cebu", "Local Governance", "Festivals & Events", "Entertainment Buzz", "Music & Arts", "Sports", "Campus News"],
  "Food": ["Cebu Favorites", "Street Food Finds", "Café & Coffee Spots", "Seafood Specials", "Sweet Treats & Desserts", "Food Reviews"]
}

// POST new article (admin only)
export async function POST(request: Request) {
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

    const body = await request.json();
    const { title, slug, content, author, category, subcategory, thumbnail_url } = body;

    // Validate category and subcategory
    if (!categories[category as keyof typeof categories]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    if (subcategory && !categories[category as keyof typeof categories].includes(subcategory)) {
      return NextResponse.json({ error: 'Invalid subcategory for this category' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        content,
        author,
        category,
        subcategory,
        thumbnail_url
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


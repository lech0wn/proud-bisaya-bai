import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/app/components/Categories';

// GET all categories and subcategories
export async function GET() {
  return NextResponse.json(CATEGORIES);
}
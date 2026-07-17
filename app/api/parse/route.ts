import { parseMarkdown } from '@/lib/parser/pipeline';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const markdownText = await request.text();
  const ast = parseMarkdown(markdownText);
  return NextResponse.json({ success: true, data: ast }, { status: 200 });
}

// app/api/parse/route.ts
// API route: принимает .md файл через FormData, передаёт текст в парсер, возвращает AST как JSON.
//
// Ожидаемый запрос:
//   POST /api/parse
//   Content-Type: multipart/form-data
//   Body: { file: <.md файл> }
//
// Ответ:
//   200 OK, Content-Type: application/json
//   Body: { ast: AstNode }
//
// TODO: implement

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // TODO: implement
  //   1. const formData = await request.formData();
  //   2. const file = formData.get('file') as File;
  //   3. const rawText = await file.text();
  //   4. const ast = parse(rawText);  // из pipeline.ts
  //   5. return NextResponse.json({ ast });
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

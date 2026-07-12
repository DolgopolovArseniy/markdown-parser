// block-parser.ts
// Блочный парсер: список токенов -> AST (дерево блочных узлов, без инлайн-разметки)
//
// Обязанности:
//   - Принимает плоский Token[] от токенизатора
//   - Строит дерево контейнеров: Document -> Heading / Paragraph / List / CodeBlock / ...
//   - НЕ занимается инлайн-разбором (bold/italic/link/code внутри текста)
//
// TODO: implement

import type { Token, AstNode } from './types';

/**
 * Принимает плоский массив токенов и строит дерево блочных AST-узлов.
 * @param tokens - плоский Token[], полученный от tokenize()
 * @returns AstNode - корневой узел Document
 */
export function parseBlocks(tokens: Token[]): AstNode {
  // TODO: implement
  void tokens;
  return undefined as never;
}

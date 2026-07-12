// pipeline.ts
// Сборка пайплайна: raw text -> tokenize -> parseBlocks -> parseInline -> готовое AST
//
// Этапы пайплайна:
//   1. tokenize()     - построчная классификация, Token[]
//   2. parseBlocks()  - Token[] -> дерево блоков (без инлайн-разбора)
//   3. parseInline()  - применяется к текстовым узлам -> добавляет инлайн-узлы
//   → Итоговое AST — JSON-сериализуемое дерево, готово к передаче клиенту
//
// TODO: implement

import type { AstNode } from './types';

/**
 * Запускает полный пайплайн: принимает raw Markdown, возвращает готовое AST.
 * @param rawMarkdown - исходный текст в формате Markdown
 * @returns AstNode - корневой узел Document с полностью разобранными инлайн-узлами
 */
export function parse(rawMarkdown: string): AstNode {
  // TODO: implement — вызвать tokenize(), parseBlocks(), применить parseInline()
  void rawMarkdown;
  return undefined as never;
}

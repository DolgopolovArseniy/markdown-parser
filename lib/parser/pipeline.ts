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

import { parseBlocks } from './block-parser';
import { parseInline } from './inline-parser';
import { tokenize } from './tokenizer';
import type {
  DocumentNode,
  UnorderedListItemBlockNode,
  OrderedListItemBlockNode,
  UnorderedListItemNode,
  OrderedListItemNode,
} from './types';

/**
 * Запускает полный пайплайн: принимает raw Markdown, возвращает готовое AST.
 * @param rawMarkdown - исходный текст в формате Markdown
 * @returns AstNode - корневой узел Document с полностью разобранными инлайн-узлами
 */

function resolveUnorderedListItem(
  item: UnorderedListItemBlockNode,
): UnorderedListItemNode {
  return {
    type: 'UnorderedListItem',
    children: parseInline(item.text),
  };
}

function resolveOrderedListItem(
  item: OrderedListItemBlockNode,
): OrderedListItemNode {
  return {
    type: 'OrderedListItem',
    listIndex: item.listIndex,
    children: parseInline(item.text),
  };
}

export function parseMarkdown(rawMarkdown: string): DocumentNode {
  // TODO: implement — вызвать tokenize(), parseBlocks(), применить parseInline()
  const tokens = tokenize(rawMarkdown);
  const initialAst = parseBlocks(tokens);

  const resolvedChildren = initialAst.children.map((node) => {
    switch (node.type) {
      case 'Heading':
        return {
          type: node.type,
          level: node.level,
          children: parseInline(node.text),
        };
      case 'Paragraph':
        return { type: node.type, children: parseInline(node.text) };
      case 'UnorderedList':
        return {
          type: node.type,
          children: node.children.map(resolveUnorderedListItem),
        };
      case 'OrderedList':
        return {
          type: node.type,
          children: node.children.map(resolveOrderedListItem),
        };
      default:
        return node;
    }
  });

  return { ...initialAst, children: resolvedChildren };
}

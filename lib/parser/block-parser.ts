// block-parser.ts
// Блочный парсер: список токенов -> AST (дерево блочных узлов, без инлайн-разметки)
//
// Обязанности:
//   - Принимает плоский Token[] от токенизатора
//   - Строит дерево контейнеров: Document -> Heading / Paragraph / List / CodeBlock / ...
//   - НЕ занимается инлайн-разбором (bold/italic/link/code внутри текста)
//
// TODO: implement

import type {
  Token,
  AstNode,
  DocumentNode,
  ParagraphNode,
  UnorderedListItemNode,
  OrderedListItemNode,
} from './types';

/**
 * Принимает плоский массив токенов и строит дерево блочных AST-узлов.
 * @param tokens - плоский Token[], полученный от tokenize()
 * @returns AstNode - корневой узел Document
 */
export function parseBlocks(tokens: Token[]): AstNode {
  const documentNode: DocumentNode = {
    type: 'Document',
    children: [],
  };

  let currentBlock:
    | ParagraphNode
    | { type: 'UnorderedList'; children: UnorderedListItemNode[] }
    | { type: 'OrderedList'; children: OrderedListItemNode[] }
    | null = null;

  function closeCurrentBlock() {
    if (!currentBlock) return;

    if (currentBlock.type === 'Paragraph') {
      currentBlock.text += '\n';
    }

    documentNode.children.push(currentBlock);
    currentBlock = null;
  }

  for (const token of tokens) {
    switch (token.type) {
      case 'BlankLine': {
        closeCurrentBlock();
        break;
      }

      case 'Heading': {
        closeCurrentBlock();
        documentNode.children.push({
          type: 'Heading',
          level: token.level,
          text: token.text,
        });
        break;
      }

      case 'CodeBlock': {
        closeCurrentBlock();
        documentNode.children.push({
          type: 'CodeBlock',
          text: token.text,
        });
        break;
      }

      case 'Paragraph': {
        if (currentBlock && currentBlock.type === 'Paragraph') {
          currentBlock.text += '\n' + token.text;
        } else {
          closeCurrentBlock();
          currentBlock = {
            type: 'Paragraph',
            text: token.text,
          };
        }
        break;
      }

      case 'UnorderedListItem': {
        if (currentBlock && currentBlock.type === 'UnorderedList') {
          currentBlock.children.push({
            type: 'UnorderedListItem',
            text: token.text,
          });
        } else {
          closeCurrentBlock();
          currentBlock = {
            type: 'UnorderedList',
            children: [
              {
                type: 'UnorderedListItem',
                text: token.text,
              },
            ],
          };
        }
        break;
      }

      case 'OrderedListItem': {
        if (currentBlock && currentBlock.type === 'OrderedList') {
          currentBlock.children.push({
            type: 'OrderedListItem',
            listIndex: token.listIndex,
            text: token.text,
          });
        } else {
          closeCurrentBlock();
          currentBlock = {
            type: 'OrderedList',
            children: [
              {
                type: 'OrderedListItem',
                listIndex: token.listIndex,
                text: token.text,
              },
            ],
          };
        }
        break;
      }

      default: {
        closeCurrentBlock();
        break;
      }
    }
  }

  closeCurrentBlock();

  return documentNode;
}

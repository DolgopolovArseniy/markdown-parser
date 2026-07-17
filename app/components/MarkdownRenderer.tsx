import { createElement, type ReactNode } from 'react';
import type { DocumentNode, InlineNode } from '@/lib/parser/types';

type BlockNode = DocumentNode['children'][number];

function renderInlineNode(node: InlineNode, index: number): ReactNode {
  switch (node.type) {
    case 'Text':
      return node.value;
    case 'Bold':
      return createElement(
        'strong',
        { key: index },
        node.children.map(renderInlineNode),
      );
    case 'Italic':
      return createElement(
        'em',
        { key: index },
        node.children.map(renderInlineNode),
      );
    case 'InlineCode':
      return createElement('code', { key: index }, node.value);
    case 'Link':
      return createElement(
        'a',
        {
          key: index,
          href: node.url,
        },
        node.children.map(renderInlineNode),
      );
  }
}

function renderBlockNode(node: BlockNode, index: number): ReactNode {
  switch (node.type) {
    case 'Heading':
      return createElement(
        `h${node.level}`,
        { key: index },
        node.children.map(renderInlineNode),
      );
    case 'Paragraph':
      return createElement(
        'p',
        { key: index },
        node.children.map(renderInlineNode),
      );
    case 'CodeBlock':
      return createElement(
        'pre',
        { key: index },
        createElement('code', null, node.text),
      );
    case 'UnorderedList':
      return createElement(
        'ul',
        { key: index },
        node.children.map((item, itemIndex) =>
          createElement(
            'li',
            { key: itemIndex },
            item.children.map(renderInlineNode),
          ),
        ),
      );
    case 'OrderedList':
      return createElement(
        'ol',
        { key: index },
        node.children.map((item, itemIndex) =>
          createElement(
            'li',
            { key: itemIndex, value: item.listIndex },
            item.children.map(renderInlineNode),
          ),
        ),
      );
  }
}

export default function MarkdownRenderer({ ast }: { ast: DocumentNode }) {
  return createElement('article', { className: 'md-content' }, ast.children.map(renderBlockNode));
}

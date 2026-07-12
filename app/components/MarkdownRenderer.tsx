// app/components/MarkdownRenderer.tsx
// Рекурсивный обход AST -> JSX (без dangerouslySetInnerHTML).
//
// Компонент принимает корневой AstNode и рекурсивно рендерит его в JSX.
// Каждый тип узла отображается в соответствующий HTML-элемент:
//   Heading    -> <h1> - <h6>
//   Paragraph  -> <p>
//   List       -> <ul> / <ol>
//   ListItem   -> <li>
//   CodeBlock  -> <pre><code>
//   Bold       -> <strong>
//   Italic     -> <em>
//   InlineCode -> <code>
//   Link       -> <a>
//   Text       -> текстовый узел
//
// TODO: implement

import type { AstNode } from '@/lib/parser/types';

interface MarkdownRendererProps {
  node: AstNode;
}

export function MarkdownRenderer({ node }: MarkdownRendererProps) {
  // TODO: implement рекурсивный обход node по полю `type`
  void node;
  return null;
}

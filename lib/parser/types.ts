// types.ts
// Автор проекта определяет все TypeScript-типы самостоятельно.
//
// Здесь будут объявлены:
//   - discriminated union для Token (поле `type` как дискриминант)
//   - discriminated union для AST-узлов (поле `type` как дискриминант)
//
// TODO: определить типы Token и AST-узлов вручную

export type HeadingNode = {
  type: 'Heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
};

export type ParagraphNode = {
  type: 'Paragraph';
  text: string;
};

export type CodeBlockNode = {
  type: 'CodeBlock';
  text: string;
};

export type UnorderedListItemNode = {
  type: 'UnorderedListItem';
  text: string;
};

export type OrderedListItemNode = {
  type: 'OrderedListItem';
  listIndex: number;
  text: string;
};

export type DocumentNode = {
  type: 'Document';
  children: AstNode[];
};

export type Token =
  | HeadingNode
  | ParagraphNode
  | UnorderedListItemNode
  | OrderedListItemNode
  | CodeBlockNode
  | { type: 'BlankLine' };

export type AstNode =
  | DocumentNode
  | HeadingNode
  | ParagraphNode
  | {
      type: 'UnorderedList';
      children: UnorderedListItemNode[];
    }
  | {
      type: 'OrderedList';
      children: OrderedListItemNode[];
    }
  | CodeBlockNode;

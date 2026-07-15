// types.ts
// Автор проекта определяет все TypeScript-типы самостоятельно.
//
// Здесь будут объявлены:
//   - discriminated union для Token (поле `type` как дискриминант)
//   - discriminated union для AST-узлов (поле `type` как дискриминант)
//
// TODO: определить типы Token и AST-узлов вручную

export type HeadingBlockNode = {
  type: 'Heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
};

export type ParagraphBlockNode = {
  type: 'Paragraph';
  text: string;
};

export type CodeBlockNode = {
  type: 'CodeBlock';
  text: string;
};

export type UnorderedListItemBlockNode = {
  type: 'UnorderedListItem';
  text: string;
};

export type OrderedListItemBlockNode = {
  type: 'OrderedListItem';
  listIndex: number;
  text: string;
};

export type UnorderedListBlockNode = {
  type: 'UnorderedList';
  children: UnorderedListItemBlockNode[];
};

export type OrderedListBlockNode = {
  type: 'OrderedList';
  children: OrderedListItemBlockNode[];
};

export type DocumentBlockNode = {
  type: 'Document';
  children: (
    | HeadingBlockNode
    | ParagraphBlockNode
    | UnorderedListBlockNode
    | OrderedListBlockNode
    | CodeBlockNode
  )[];
};

export type Token =
  | HeadingBlockNode
  | ParagraphBlockNode
  | UnorderedListItemBlockNode
  | OrderedListItemBlockNode
  | CodeBlockNode
  | { type: 'BlankLine' };

export type InlineToken =
  | { type: 'BoldMarker'; pos: number; canOpen: boolean; canClose: boolean }
  | { type: 'ItalicMarker'; pos: number; canOpen: boolean; canClose: boolean }
  | { type: 'CodeMarker'; pos: number; canOpen: boolean; canClose: boolean };

export type InlineNode =
  | { type: 'Text'; value: string }
  | { type: 'Bold'; children: InlineNode[] }
  | { type: 'Italic'; children: InlineNode[] }
  | { type: 'InlineCode'; value: string }
  | { type: 'Link'; url: string; children: InlineNode[] };

export type HeadingNode = Omit<HeadingBlockNode, 'text'> & {
  children: InlineNode[];
};

export type ParagraphNode = Omit<ParagraphBlockNode, 'text'> & {
  children: InlineNode[];
};

export type UnorderedListItemNode = Omit<UnorderedListItemBlockNode, 'text'> & {
  children: InlineNode[];
};

export type OrderedListItemNode = Omit<OrderedListItemBlockNode, 'text'> & {
  children: InlineNode[];
};

export type UnorderedListNode = {
  type: 'UnorderedList';
  children: UnorderedListItemNode[];
};

export type OrderedListNode = {
  type: 'OrderedList';
  children: OrderedListItemNode[];
};

export type DocumentNode = {
  type: 'Document';
  children: (
    | HeadingNode
    | ParagraphNode
    | UnorderedListNode
    | OrderedListNode
    | CodeBlockNode
  )[];
};

export type AstNode =
  | DocumentNode
  | HeadingNode
  | ParagraphNode
  | UnorderedListNode
  | OrderedListNode
  | CodeBlockNode
  | UnorderedListItemNode
  | OrderedListItemNode
  | InlineNode;

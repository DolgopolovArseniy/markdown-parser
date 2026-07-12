// types.ts
// Автор проекта определяет все TypeScript-типы самостоятельно.
//
// Здесь будут объявлены:
//   - discriminated union для Token (поле `type` как дискриминант)
//   - discriminated union для AST-узлов (поле `type` как дискриминант)
//
// TODO: определить типы Token и AST-узлов вручную

export type Token =
  | { type: 'Heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: 'Paragraph'; text: string }
  | {
      type: 'UnorderedListItem';
      text: string;
    }
  | {
      type: 'OrderedListItem';
      listIndex: number;
      text: string;
    }
  | { type: 'CodeBlock'; text: string }
  | { type: 'BlankLine' };
export type AstNode = never; // TODO: заменить на discriminated union (узел AST)

// types.ts
// Автор проекта определяет все TypeScript-типы самостоятельно.
//
// Здесь будут объявлены:
//   - discriminated union для Token (поле `type` как дискриминант)
//   - discriminated union для AST-узлов (поле `type` как дискриминант)
//
// TODO: определить типы Token и AST-узлов вручную

export type Token = never; // TODO: заменить на discriminated union (тип токена)
export type AstNode = never; // TODO: заменить на discriminated union (узел AST)

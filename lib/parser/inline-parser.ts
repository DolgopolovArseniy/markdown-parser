// inline-parser.ts
// Инлайн-парсер: raw-текст узла -> список инлайн-узлов
//
// Обязанности:
//   - Применяется точечно к текстовым узлам: Paragraph / Heading / ListItem
//   - Разбирает инлайн-разметку: bold (**text**), italic (*text*),
//     инлайн-код (`code`), ссылки ([text](url))
//   - Содержимое CodeBlock НЕ проходит инлайн-парсинг
//   - Отдельный проход, не смешивается с блочным парсингом
//
// TODO: implement

import type { AstNode } from './types';

/**
 * Принимает raw-текст одного текстового блока и возвращает список инлайн-узлов.
 * @param rawText - строка с инлайн-разметкой Markdown
 * @returns AstNode[] - массив инлайн-узлов (Text, Bold, Italic, InlineCode, Link)
 */
export function parseInline(rawText: string): AstNode[] {
  // TODO: implement
  void rawText;
  return [];
}

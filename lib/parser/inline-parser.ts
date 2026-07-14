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

import type { AstNode, InlineToken } from './types';

/**
 * Tokenizes the input string into a list of inline tokens.
 * It looks for BoldMarker (**), ItalicMarker (*), and CodeMarker (`).
 *
 * @param text The input string to tokenize.
 * @returns An array of InlineToken objects.
 */
export function inlineTokenize(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let i = 0;
  const length = text.length;

  while (i < length) {
    let markerType: 'BoldMarker' | 'ItalicMarker' | 'CodeMarker' | null = null;
    let markerLength = 0;

    // Check for BoldMarker (**)
    if (text.startsWith('**', i)) {
      markerType = 'BoldMarker';
      markerLength = 2;
    }
    // Check for ItalicMarker (*)
    else if (text.startsWith('*', i)) {
      markerType = 'ItalicMarker';
      markerLength = 1;
    }
    // Check for CodeMarker (`)
    else if (text.startsWith('`', i)) {
      markerType = 'CodeMarker';
      markerLength = 1;
    }

    if (markerType !== null) {
      const pos = i;
      const charBefore = pos > 0 ? text[pos - 1] : undefined;
      const charAfter = pos + markerLength < length ? text[pos + markerLength] : undefined;

      const isWhitespace = (char: string | undefined): boolean => {
        if (char === undefined) return false;
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
      };

      const canOpen = charAfter !== undefined && !isWhitespace(charAfter);
      const canClose = charBefore !== undefined && !isWhitespace(charBefore);

      tokens.push({
        type: markerType,
        pos,
        canOpen,
        canClose,
      });

      i += markerLength;
    } else {
      i++;
    }
  }

  return tokens;
}

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


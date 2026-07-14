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

import type { InlineToken, InlineNode } from './types';

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
      const charAfter =
        pos + markerLength < length ? text[pos + markerLength] : undefined;

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
 * @returns InlineNode[] - массив инлайн-узлов (Text, Bold, Italic, InlineCode, Link)
 */
export function parseInline(rawText: string): InlineNode[] {
  if (!rawText) return [];

  const LINK_REGEX = /\[([^\]]*)\]\(([^)]*)\)/y;

  const tokens = inlineTokenize(rawText);
  const nodes: InlineNode[] = [];
  let currentText = '';
  let i = 0;
  let tokenIndex = 0;
  const length = rawText.length;

  while (i < length) {
    // 1. Check for Link using sticky regex (matched at current position i)
    LINK_REGEX.lastIndex = i;
    const linkMatch = LINK_REGEX.exec(rawText);
    if (linkMatch) {
      if (currentText) {
        nodes.push({ type: 'Text', value: currentText });
        currentText = '';
      }

      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];

      // Recursively parse the text inside the link
      const innerNodes = parseInline(linkText);

      nodes.push({
        type: 'Link',
        url: linkUrl,
        children: innerNodes,
      });

      i = LINK_REGEX.lastIndex;
      continue;
    }

    // 2. Align token cursor to current index i
    while (tokenIndex < tokens.length && tokens[tokenIndex].pos < i) {
      tokenIndex++;
    }

    const token = tokens[tokenIndex];
    if (token && token.pos === i) {
      let isMatched = false;
      const markerLength = token.type === 'BoldMarker' ? 2 : 1;

      if (token.canOpen) {
        // Search for matching closing token of the same type
        let closingToken: InlineToken | undefined = undefined;
        for (let j = tokenIndex + 1; j < tokens.length; j++) {
          const nextToken = tokens[j];
          if (nextToken.type === token.type && nextToken.canClose) {
            closingToken = nextToken;
            break;
          }
        }

        if (closingToken) {
          if (currentText) {
            nodes.push({ type: 'Text', value: currentText });
            currentText = '';
          }

          const content = rawText.substring(i + markerLength, closingToken.pos);

          if (token.type === 'BoldMarker') {
            nodes.push({
              type: 'Bold',
              children: [{ type: 'Text', value: content }],
            });
          } else if (token.type === 'ItalicMarker') {
            nodes.push({
              type: 'Italic',
              children: [{ type: 'Text', value: content }],
            });
          } else if (token.type === 'CodeMarker') {
            nodes.push({
              type: 'InlineCode',
              value: content,
            });
          }

          i = closingToken.pos + markerLength;
          isMatched = true;
        }
      }

      if (isMatched) {
        continue;
      }
    }

    // 3. Fallback: treat the character at i as plain text
    currentText += rawText[i];
    i++;
  }

  if (currentText) {
    nodes.push({ type: 'Text', value: currentText });
  }

  return nodes;
}

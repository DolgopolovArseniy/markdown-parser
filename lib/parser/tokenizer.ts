// tokenizer.ts
// Токенизатор: raw text -> список токенов (плоский массив)
//
// Обязанности:
//   - Построчная классификация входного текста
//   - Возвращает плоский массив Token[] (НЕ строит вложенность)
//
// TODO: implement

import type { Token } from './types';

/**
 * Принимает raw-текст Markdown и возвращает плоский список токенов.
 * @param rawText - исходный текст в формате Markdown
 * @returns Token[] - плоский массив токенов
 */

const HEADING_REGEX = /^(#{1,6}) (.+)/; // начинается с 1–6 '#', пробел, текст
const UNORDERED_LIST_REGEX = /^[-*] (.+)/; // начинается с '-' или '*', пробел, текст
const ORDERED_LIST_REGEX = /^(\d+)\. (.+)/; // начинается с числа, точка, пробел, текст
const BLANK_LINE_REGEX = /^\s*$/; // пустая строка или строка из пробелов/табов

export function tokenize(rawText: string): Token[] {
  const lines = rawText.split('\n');
  const tokens: Token[] = [];

  lines.forEach((line) => {
    const headingMatch = line.match(HEADING_REGEX);

    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const text = headingMatch[2];
      tokens.push({ type: 'Heading', level, text });

      return;
    }

    const unorderedListItemMatch = line.match(UNORDERED_LIST_REGEX);
    if (unorderedListItemMatch) {
      const text = unorderedListItemMatch[1];
      tokens.push({ type: 'UnorderedListItem', text });

      return;
    }

    const orderedListItemMatch = line.match(ORDERED_LIST_REGEX);
    if (orderedListItemMatch) {
      const listIndex = +orderedListItemMatch[1];
      const text = orderedListItemMatch[2];
      tokens.push({ type: 'OrderedListItem', listIndex, text });

      return;
    }

    const blankLineMatch = line.match(BLANK_LINE_REGEX);
    if (blankLineMatch) {
      tokens.push({ type: 'BlankLine' });

      return;
    }
  });

  return tokens;
}

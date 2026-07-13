import { describe, it, expect } from 'vitest';
import { parseBlocks } from '../block-parser';

import type { Token } from '../types';

describe('parseBlocks', () => {
  it('should return an empty Document for empty tokens list', () => {
    expect(parseBlocks([])).toEqual({
      type: 'Document',
      children: [],
    });
  });

  it('should parse a single Heading token', () => {
    const tokens: Token[] = [{ type: 'Heading', level: 1, text: 'Hello World' }];
    expect(parseBlocks(tokens)).toEqual({
      type: 'Document',
      children: [
        { type: 'Heading', level: 1, text: 'Hello World' },
      ],
    });
  });

  it('should parse a single CodeBlock token', () => {
    const tokens: Token[] = [{ type: 'CodeBlock', text: 'const x = 1;' }];
    expect(parseBlocks(tokens)).toEqual({
      type: 'Document',
      children: [
        { type: 'CodeBlock', text: 'const x = 1;' },
      ],
    });
  });

  it('should group consecutive Paragraph tokens into a single paragraph node with a trailing newline', () => {
    const tokens: Token[] = [
      { type: 'Paragraph', text: 'First line' },
      { type: 'Paragraph', text: 'Second line' },
    ];
    expect(parseBlocks(tokens)).toEqual({
      type: 'Document',
      children: [
        { type: 'Paragraph', text: 'First line\nSecond line\n' },
      ],
    });
  });

  it('should group consecutive UnorderedListItem tokens into a single UnorderedList', () => {
    const tokens: Token[] = [
      { type: 'UnorderedListItem', text: 'Item 1' },
      { type: 'UnorderedListItem', text: 'Item 2' },
    ];
    expect(parseBlocks(tokens)).toEqual({
      type: 'Document',
      children: [
        {
          type: 'UnorderedList',
          children: [
            { type: 'UnorderedListItem', text: 'Item 1' },
            { type: 'UnorderedListItem', text: 'Item 2' },
          ],
        },
      ],
    });
  });

  it('should group consecutive OrderedListItem tokens into a single OrderedList', () => {
    const tokens: Token[] = [
      { type: 'OrderedListItem', listIndex: 1, text: 'First' },
      { type: 'OrderedListItem', listIndex: 2, text: 'Second' },
    ];
    expect(parseBlocks(tokens)).toEqual({
      type: 'Document',
      children: [
        {
          type: 'OrderedList',
          children: [
            { type: 'OrderedListItem', listIndex: 1, text: 'First' },
            { type: 'OrderedListItem', listIndex: 2, text: 'Second' },
          ],
        },
      ],
    });
  });

  it('should handle BlankLine tokens by closing the current block', () => {
    const tokens: Token[] = [
      { type: 'Paragraph', text: 'Para 1' },
      { type: 'BlankLine' },
      { type: 'Paragraph', text: 'Para 2' },
    ];
    expect(parseBlocks(tokens)).toEqual({
      type: 'Document',
      children: [
        { type: 'Paragraph', text: 'Para 1\n' },
        { type: 'Paragraph', text: 'Para 2\n' },
      ],
    });
  });

  it('should close current block when switching node types', () => {
    const tokens: Token[] = [
      { type: 'Paragraph', text: 'Some text' },
      { type: 'UnorderedListItem', text: 'Bullet point' },
      { type: 'Heading', level: 2, text: 'Subheading' },
    ];
    expect(parseBlocks(tokens)).toEqual({
      type: 'Document',
      children: [
        { type: 'Paragraph', text: 'Some text\n' },
        {
          type: 'UnorderedList',
          children: [{ type: 'UnorderedListItem', text: 'Bullet point' }],
        },
        { type: 'Heading', level: 2, text: 'Subheading' },
      ],
    });
  });
});

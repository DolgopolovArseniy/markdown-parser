import { describe, it, expect } from 'vitest';
import { tokenize } from '../tokenizer';

describe('tokenize', () => {
  // ─── Edge cases ────────────────────────────────────────────────────────────

  it('should return an empty array for empty input', () => {
    expect(tokenize('')).toEqual([]);
  });

  // ─── BlankLine ─────────────────────────────────────────────────────────────

  it('should tokenize a blank line', () => {
    expect(tokenize('\n')).toEqual([{ type: 'BlankLine' }, { type: 'BlankLine' }]);
  });

  it('should tokenize a whitespace-only line as BlankLine', () => {
    expect(tokenize('   ')).toEqual([{ type: 'BlankLine' }]);
  });

  // ─── Heading ───────────────────────────────────────────────────────────────

  it('should tokenize an H1 heading', () => {
    expect(tokenize('# Hello')).toEqual([{ type: 'Heading', level: 1, text: 'Hello' }]);
  });

  it('should tokenize an H2 heading', () => {
    expect(tokenize('## Hello')).toEqual([{ type: 'Heading', level: 2, text: 'Hello' }]);
  });

  it('should tokenize an H6 heading', () => {
    expect(tokenize('###### Deep')).toEqual([{ type: 'Heading', level: 6, text: 'Deep' }]);
  });

  it('should NOT tokenize 7 hashes as a heading', () => {
    expect(tokenize('####### Too deep')).toEqual([
      { type: 'Paragraph', text: '####### Too deep' },
    ]);
  });

  // ─── UnorderedListItem ─────────────────────────────────────────────────────

  it('should tokenize a dash list item', () => {
    expect(tokenize('- item')).toEqual([{ type: 'UnorderedListItem', text: 'item' }]);
  });

  it('should tokenize an asterisk list item', () => {
    expect(tokenize('* item')).toEqual([{ type: 'UnorderedListItem', text: 'item' }]);
  });

  // ─── OrderedListItem ───────────────────────────────────────────────────────

  it('should tokenize an ordered list item', () => {
    expect(tokenize('1. First')).toEqual([
      { type: 'OrderedListItem', listIndex: 1, text: 'First' },
    ]);
  });

  it('should tokenize an ordered list item with index > 1', () => {
    expect(tokenize('42. Answer')).toEqual([
      { type: 'OrderedListItem', listIndex: 42, text: 'Answer' },
    ]);
  });

  it('should parse listIndex as a number, not a string', () => {
    const [token] = tokenize('3. Item');
    expect(token.type).toBe('OrderedListItem');
    if (token.type === 'OrderedListItem') {
      expect(typeof token.listIndex).toBe('number');
    }
  });

  // ─── Paragraph ─────────────────────────────────────────────────────────────

  it('should tokenize a plain text line as Paragraph', () => {
    expect(tokenize('Hello world')).toEqual([{ type: 'Paragraph', text: 'Hello world' }]);
  });

  // ─── CodeBlock ─────────────────────────────────────────────────────────────

  it('should tokenize a code block', () => {
    expect(tokenize('```\nconst x = 1;\n```')).toEqual([
      { type: 'CodeBlock', text: 'const x = 1;' },
    ]);
  });

  it('should tokenize a code block with language hint', () => {
    expect(tokenize('```ts\nconst x = 1;\n```')).toEqual([
      { type: 'CodeBlock', text: 'const x = 1;' },
    ]);
  });

  it('should tokenize a multi-line code block', () => {
    expect(tokenize('```\nline one\nline two\n```')).toEqual([
      { type: 'CodeBlock', text: 'line one\nline two' },
    ]);
  });

  it('should handle an unclosed code block — flush remaining lines', () => {
    expect(tokenize('```\norphan line')).toEqual([
      { type: 'CodeBlock', text: 'orphan line' },
    ]);
  });

  // ─── Mixed input ───────────────────────────────────────────────────────────

  it('should tokenize mixed markdown into correct flat token array', () => {
    const input = [
      '# Title',
      '',
      'Some paragraph',
      '',
      '- item one',
      '- item two',
    ].join('\n');

    expect(tokenize(input)).toEqual([
      { type: 'Heading', level: 1, text: 'Title' },
      { type: 'BlankLine' },
      { type: 'Paragraph', text: 'Some paragraph' },
      { type: 'BlankLine' },
      { type: 'UnorderedListItem', text: 'item one' },
      { type: 'UnorderedListItem', text: 'item two' },
    ]);
  });
});

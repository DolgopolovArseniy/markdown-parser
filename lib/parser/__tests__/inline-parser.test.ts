import { describe, it, expect } from 'vitest';
import { parseInline, inlineTokenize } from '../inline-parser';

describe('parseInline', () => {
  it('should return an empty array for empty input', () => {
    expect(parseInline('')).toEqual([]);
  });

  it('should parse plain text without formatting', () => {
    expect(parseInline('Hello world')).toEqual([
      { type: 'Text', value: 'Hello world' },
    ]);
  });

  it('should parse standard bold markdown', () => {
    expect(parseInline('**bold**')).toEqual([
      { type: 'Bold', children: [{ type: 'Text', value: 'bold' }] },
    ]);
  });

  it('should parse standard italic markdown', () => {
    expect(parseInline('*italic*')).toEqual([
      { type: 'Italic', children: [{ type: 'Text', value: 'italic' }] },
    ]);
  });

  it('should parse standard code markdown', () => {
    expect(parseInline('`code`')).toEqual([
      { type: 'InlineCode', value: 'code' },
    ]);
  });

  it('should parse a flat link', () => {
    expect(parseInline('[google](https://google.com)')).toEqual([
      {
        type: 'Link',
        url: 'https://google.com',
        children: [{ type: 'Text', value: 'google' }],
      },
    ]);
  });

  it('should parse a link recursively containing other formats', () => {
    expect(parseInline('[google with **bold** and *italic*](url)')).toEqual([
      {
        type: 'Link',
        url: 'url',
        children: [
          { type: 'Text', value: 'google with ' },
          { type: 'Bold', children: [{ type: 'Text', value: 'bold' }] },
          { type: 'Text', value: ' and ' },
          { type: 'Italic', children: [{ type: 'Text', value: 'italic' }] },
        ],
      },
    ]);
  });

  it('should parse mixed inline contents', () => {
    expect(parseInline('Hello **bold** and *italic* and `code`!')).toEqual([
      { type: 'Text', value: 'Hello ' },
      { type: 'Bold', children: [{ type: 'Text', value: 'bold' }] },
      { type: 'Text', value: ' and ' },
      { type: 'Italic', children: [{ type: 'Text', value: 'italic' }] },
      { type: 'Text', value: ' and ' },
      { type: 'InlineCode', value: 'code' },
      { type: 'Text', value: '!' },
    ]);
  });

  it('should treat unmatched markers as plain text', () => {
    expect(parseInline('**bold')).toEqual([{ type: 'Text', value: '**bold' }]);
    expect(parseInline('foo * bar')).toEqual([{ type: 'Text', value: 'foo * bar' }]);
    expect(parseInline('`code')).toEqual([{ type: 'Text', value: '`code' }]);
  });

  it('should handle unmatched nested delimiters according to greedy tokenization rules', () => {
    // ***bolditalic*** parses as Bold containing *bolditalic and trailing text *
    expect(parseInline('***bolditalic***')).toEqual([
      { type: 'Bold', children: [{ type: 'Text', value: '*bolditalic' }] },
      { type: 'Text', value: '*' },
    ]);
  });

  it('should recursively parse nested formatting inside Bold and Italic', () => {
    // Link inside Bold
    expect(parseInline('**[text](url)**')).toEqual([
      {
        type: 'Bold',
        children: [
          {
            type: 'Link',
            url: 'url',
            children: [{ type: 'Text', value: 'text' }],
          },
        ],
      },
    ]);

    // Italic inside Bold
    expect(parseInline('**bold *italic* bold**')).toEqual([
      {
        type: 'Bold',
        children: [
          { type: 'Text', value: 'bold ' },
          { type: 'Italic', children: [{ type: 'Text', value: 'italic' }] },
          { type: 'Text', value: ' bold' },
        ],
      },
    ]);

    // Bold inside Italic
    expect(parseInline('*italic **bold** italic*')).toEqual([
      {
        type: 'Italic',
        children: [
          { type: 'Text', value: 'italic ' },
          { type: 'Bold', children: [{ type: 'Text', value: 'bold' }] },
          { type: 'Text', value: ' italic' },
        ],
      },
    ]);
  });
});

describe('inlineTokenize', () => {
  it('should return an empty array for empty input', () => {
    expect(inlineTokenize('')).toEqual([]);
  });

  it('should return empty array if no markers present', () => {
    expect(inlineTokenize('Hello world')).toEqual([]);
  });

  it('should tokenize standard bold marker', () => {
    expect(inlineTokenize('**bold**')).toEqual([
      { type: 'BoldMarker', pos: 0, canOpen: true, canClose: false },
      { type: 'BoldMarker', pos: 6, canOpen: false, canClose: true },
    ]);
  });

  it('should tokenize standard italic marker', () => {
    expect(inlineTokenize('*italic*')).toEqual([
      { type: 'ItalicMarker', pos: 0, canOpen: true, canClose: false },
      { type: 'ItalicMarker', pos: 7, canOpen: false, canClose: true },
    ]);
  });

  it('should tokenize standard code marker', () => {
    expect(inlineTokenize('`code`')).toEqual([
      { type: 'CodeMarker', pos: 0, canOpen: true, canClose: false },
      { type: 'CodeMarker', pos: 5, canOpen: false, canClose: true },
    ]);
  });

  it('should handle whitespace before and after markers correctly', () => {
    // Spacer after opening marker, spacer before closing marker
    expect(inlineTokenize('** bold **')).toEqual([
      { type: 'BoldMarker', pos: 0, canOpen: false, canClose: false },
      { type: 'BoldMarker', pos: 8, canOpen: false, canClose: false },
    ]);

    // Space before opening and after closing
    expect(inlineTokenize('foo **bar** baz')).toEqual([
      { type: 'BoldMarker', pos: 4, canOpen: true, canClose: false },
      { type: 'BoldMarker', pos: 9, canOpen: false, canClose: true },
    ]);
  });

  it('should support tabs and newlines as whitespace', () => {
    expect(inlineTokenize('**\tbold\n**')).toEqual([
      { type: 'BoldMarker', pos: 0, canOpen: false, canClose: false },
      { type: 'BoldMarker', pos: 8, canOpen: false, canClose: false },
    ]);
  });

  it('should support intraword markers (canOpen = true, canClose = true)', () => {
    expect(inlineTokenize('a*b*c')).toEqual([
      { type: 'ItalicMarker', pos: 1, canOpen: true, canClose: true },
      { type: 'ItalicMarker', pos: 3, canOpen: true, canClose: true },
    ]);
  });

  it('should handle nested/adjacent markers correctly (longest-match left-to-right greedy)', () => {
    // ***bolditalic***
    // pos 0: BoldMarker (**) -> pos 2: ItalicMarker (*)
    // pos 13: BoldMarker (**) -> pos 15: ItalicMarker (*)
    expect(inlineTokenize('***bolditalic***')).toEqual([
      { type: 'BoldMarker', pos: 0, canOpen: true, canClose: false },
      { type: 'ItalicMarker', pos: 2, canOpen: true, canClose: true },
      { type: 'BoldMarker', pos: 13, canOpen: true, canClose: true },
      { type: 'ItalicMarker', pos: 15, canOpen: false, canClose: true },
    ]);
  });
});


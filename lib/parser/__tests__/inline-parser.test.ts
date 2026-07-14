import { describe, it, expect } from 'vitest';
import { parseInline, inlineTokenize } from '../inline-parser';

describe('parseInline', () => {
  it('should return an empty array for empty input', () => {
    expect(parseInline('')).toEqual([]);
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


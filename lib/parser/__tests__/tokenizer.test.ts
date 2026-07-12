import { describe, it, expect } from 'vitest';
import { tokenize } from '../tokenizer';

describe('tokenize', () => {
  it('should return an empty array for empty input', () => {
    // TODO: implement tokenize(), then fill in real test cases
    expect(tokenize('')).toEqual([]);
  });
});

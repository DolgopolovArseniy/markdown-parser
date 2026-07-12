import { describe, it, expect } from 'vitest';
import { parseInline } from '../inline-parser';

describe('parseInline', () => {
  it('should return an empty array for empty input', () => {
    // TODO: implement parseInline(), then fill in real test cases
    expect(parseInline('')).toEqual([]);
  });
});

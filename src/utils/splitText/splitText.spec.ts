import type { SplitType } from '../../types';

import { splitText } from './splitText';

describe('splitText utility', () => {
  describe('when using a valid split type', () => {
    const testCases: [SplitType, string, string[]][] = [
      ['character', 'Hello', ['H', 'e', 'l', 'l', 'o']],
      ['word', 'Hello World', ['Hello', ' ', 'World']],
      ['line', 'Hello\nWorld', ['Hello', '\n', 'World']],
    ];

    it.each(testCases)('should split the text by %s', (split, input, expected) => {
      expect(splitText(input, split)).toEqual(expected);
    });
  });

  describe('when using an invalid split type', () => {
    it('should default to splitting by character', () => {
      const input = 'Hi';
      const expected = ['H', 'i'];
      const invalidSplitType = 'invalid' as any;

      expect(splitText(input, invalidSplitType)).toEqual(expected);
    });
  });
});

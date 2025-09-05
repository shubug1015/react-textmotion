import { useSplitText } from './useSplitText';

describe('useSplitText hook', () => {
  it.each([
    ['character', 'Hello', ['H', 'e', 'l', 'l', 'o']],
    ['word', 'Hello World', ['Hello', ' ', 'World']],
    ['line', 'Hello\nWorld', ['Hello', '\n', 'World']],
    ['invalid' as any, 'Hi', ['H', 'i']],
  ])('splits "%s" correctly', (split, input, expected) => {
    expect(useSplitText(input, split as any)).toEqual(expected);
  });
});

import { splitText } from './splitText';

describe('splitText utility', () => {
  it.each([
    ['character', 'Hello', ['H', 'e', 'l', 'l', 'o']],
    ['word', 'Hello World', ['Hello', ' ', 'World']],
    ['invalid' as any, 'Hi', ['H', 'i']],
  ])('splits "%s" correctly', (split, input, expected) => {
    expect(splitText(input, split as any)).toEqual(expected);
  });
});

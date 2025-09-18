import { splitNodeAndExtractText } from './splitNodeAndExtractText';

describe('splitNodeAndExtractText utility', () => {
  it('splits a string into individual characters when split type is "character"', () => {
    const { splittedNode, text } = splitNodeAndExtractText('Hi', 'character');

    expect(splittedNode).toHaveLength(2);
    expect(splittedNode[0]).toBe('H');
    expect(splittedNode[1]).toBe('i');
    expect(text).toBe('Hi');
  });

  it('splits a number into individual characters when split type is "character"', () => {
    const { splittedNode, text } = splitNodeAndExtractText(123, 'character');

    expect(splittedNode).toHaveLength(3);
    expect(splittedNode[0]).toBe('1');
    expect(splittedNode[1]).toBe('2');
    expect(splittedNode[2]).toBe('3');
    expect(text).toBe('123');
  });

  it('returns empty array and empty text when input is an empty string', () => {
    const { splittedNode, text } = splitNodeAndExtractText('', 'character');

    expect(splittedNode).toHaveLength(0);
    expect(text).toBe('');
  });

  it('recursively splits children of a valid React element', () => {
    const { splittedNode, text } = splitNodeAndExtractText(<strong>Hello</strong>, 'character');

    expect(splittedNode).toHaveLength(1);
    expect(text).toBe('Hello');
  });

  it('returns element itself with empty text when React element has no children', () => {
    const { splittedNode, text } = splitNodeAndExtractText(<span />, 'character');

    expect(splittedNode).toHaveLength(1);
    expect(text).toBe('');
  });

  it('splits an array of nodes into combined substrings and concatenated text', () => {
    const { splittedNode, text } = splitNodeAndExtractText(['Hello', ' ', 'World'], 'character');

    expect(splittedNode).toHaveLength(11);
    expect(text).toBe('Hello World');
  });

  it('returns empty array and empty text when input is null or boolean', () => {
    const { splittedNode, text } = splitNodeAndExtractText(null, 'character');
    const boolResult = splitNodeAndExtractText(true, 'character');

    expect(splittedNode).toEqual([]);
    expect(text).toBe('');

    expect(boolResult.splittedNode).toEqual([]);
    expect(boolResult.text).toBe('');
  });

  it('returns node as-is with empty text when input is an unsupported type', () => {
    const symbolNode = Symbol('test');
    const fnNode = () => 'test';

    const symbolResult = splitNodeAndExtractText(symbolNode as any, 'character');
    const fnResult = splitNodeAndExtractText(fnNode as any, 'character');

    expect(symbolResult.splittedNode).toEqual([symbolNode]);
    expect(symbolResult.text).toBe('');

    expect(fnResult.splittedNode).toEqual([fnNode]);
    expect(fnResult.text).toBe('');
  });

  it('splits a string into words and spaces when split type is "word"', () => {
    const { splittedNode, text } = splitNodeAndExtractText('Hello World', 'word');

    expect(splittedNode).toHaveLength(3);
    expect(splittedNode[0]).toBe('Hello');
    expect(splittedNode[1]).toBe(' ');
    expect(splittedNode[2]).toBe('World');
    expect(text).toBe('Hello World');
  });
});

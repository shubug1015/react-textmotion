import { splitReactNode } from './splitReactNode';

describe('splitReactNode utility', () => {
  it('splits a string into individual characters when split type is "character"', () => {
    const { nodes, text } = splitReactNode('Hi', 'character');

    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toBe('H');
    expect(nodes[1]).toBe('i');
    expect(text).toBe('Hi');
  });

  it('splits a number into individual characters when split type is "character"', () => {
    const { nodes, text } = splitReactNode(123, 'character');

    expect(nodes).toHaveLength(3);
    expect(nodes[0]).toBe('1');
    expect(nodes[1]).toBe('2');
    expect(nodes[2]).toBe('3');
    expect(text).toBe('123');
  });

  it('returns empty array and empty text when input is an empty string', () => {
    const { nodes, text } = splitReactNode('', 'character');

    expect(nodes).toHaveLength(0);
    expect(text).toBe('');
  });

  it('recursively splits children of a valid React element', () => {
    const { nodes, text } = splitReactNode(<strong>Hello</strong>, 'character');

    expect(nodes).toHaveLength(1);
    expect(text).toBe('Hello');
  });

  it('returns element itself with empty text when React element has no children', () => {
    const { nodes, text } = splitReactNode(<span />, 'character');

    expect(nodes).toHaveLength(1);
    expect(text).toBe('');
  });

  it('splits an array of nodes into combined substrings and concatenated text', () => {
    const { nodes, text } = splitReactNode(['Hello', ' ', 'World'], 'character');

    expect(nodes).toHaveLength(11);
    expect(text).toBe('Hello World');
  });

  it('returns empty array and empty text when input is null or boolean', () => {
    const { nodes, text } = splitReactNode(null, 'character');
    const boolResult = splitReactNode(true, 'character');

    expect(nodes).toEqual([]);
    expect(text).toBe('');

    expect(boolResult.nodes).toEqual([]);
    expect(boolResult.text).toBe('');
  });

  it('returns node as-is with empty text when input is an unsupported type', () => {
    const symbolNode = Symbol('test');
    const fnNode = () => 'test';

    const symbolResult = splitReactNode(symbolNode as any, 'character');
    const fnResult = splitReactNode(fnNode as any, 'character');

    expect(symbolResult.nodes).toEqual([symbolNode]);
    expect(symbolResult.text).toBe('');

    expect(fnResult.nodes).toEqual([fnNode]);
    expect(fnResult.text).toBe('');
  });

  it('splits a string into words and spaces when split type is "word"', () => {
    const { nodes, text } = splitReactNode('Hello World', 'word');

    expect(nodes).toHaveLength(3);
    expect(nodes[0]).toBe('Hello');
    expect(nodes[1]).toBe(' ');
    expect(nodes[2]).toBe('World');
    expect(text).toBe('Hello World');
  });
});

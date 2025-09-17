import { render } from '@testing-library/react';

import { splitNode } from './splitNodeAndExtractText';

describe('splitNode utility', () => {
  const split = 'character';

  it('splits string into animated spans', () => {
    const node = 'Hi';
    const result = splitNode(node, split);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe('H');
    expect(spans[1].textContent).toBe('i');
    expect(result.length).toBe(2);
  });

  it('splits number into animated spans', () => {
    const node = 123;
    const result = splitNode(node, split);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(3);
    expect(spans[0].textContent).toBe('1');
    expect(spans[1].textContent).toBe('2');
    expect(spans[2].textContent).toBe('3');
    expect(result.length).toBe(3);
  });

  it('handles node without sequenceIndex', () => {
    const node = '1';
    const result = splitNode(node, split);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(1);
    expect(spans[0].textContent).toBe('1');
    expect(result.length).toBe(1);
  });

  it('recursively handles nested elements', () => {
    const node = <strong>Hello</strong>;
    const result = splitNode(node, split);

    const { container } = render(<>{result}</>);
    const strong = container.querySelector('strong') as HTMLElement;
    const spans = strong.querySelectorAll('span');

    expect(strong).toBeInTheDocument();
    expect(spans.length).toBe('Hello'.length);
    expect(result.length).toBe('Hello'.length);
  });

  it('handles arrays of nodes', () => {
    const node = ['Hello', ' ', 'World'];
    const result = splitNode(node, split);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(11);
    expect(result.length).toBe(11);
  });

  it('handles null and boolean nodes', () => {
    const nullNode = null;
    const booleanNode = true;

    const nullResult = splitNode(nullNode, split);
    const booleanResult = splitNode(booleanNode, split);

    expect(nullResult).toEqual([]);
    expect(nullResult.length).toBe(0);

    expect(booleanResult).toEqual([]);
    expect(booleanResult.length).toBe(0);
  });

  it('handles unknown node types by returning the node as-is', () => {
    const unknownNode = Symbol('test');
    const result = splitNode(unknownNode as any, split);

    expect(result).toEqual([unknownNode]);
    expect(result.length).toBe(0);
  });
});

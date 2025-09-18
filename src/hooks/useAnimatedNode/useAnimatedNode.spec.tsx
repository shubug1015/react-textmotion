import { ReactNode } from 'react';
import { render, renderHook } from '@testing-library/react';

import { MotionConfig } from '../../types';
import { splitNodeAndExtractText } from '../../utils/splitNodeAndExtractText';

import { useAnimatedNode } from './useAnimatedNode';

const renderAnimatedNode = (
  children: ReactNode,
  split: 'character' | 'word',
  motion: MotionConfig = {},
  initialDelay = 0
) => {
  const { splittedNode } = splitNodeAndExtractText(children, split);
  const { result } = renderHook(() => useAnimatedNode(splittedNode, initialDelay, motion));
  const { container } = render(<>{result.current}</>);

  return container.querySelectorAll('span');
};

describe('useAnimatedNode hook', () => {
  const split = 'character';
  const motion: MotionConfig = {};

  it('generates animated spans for string children', () => {
    const spans = renderAnimatedNode('Hey', split, motion);

    expect(spans).toHaveLength(3);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['H', 'e', 'y']);
  });

  it('handles number children', () => {
    const spans = renderAnimatedNode(123, split, motion);

    expect(spans).toHaveLength(3);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['1', '2', '3']);
  });

  it('handles empty string gracefully', () => {
    const spans = renderAnimatedNode('', split, motion);

    expect(spans).toHaveLength(0);
  });

  it('handles nested React elements with text', () => {
    const { splittedNode } = splitNodeAndExtractText(<p>Hello</p>, split);
    const { result } = renderHook(() => useAnimatedNode(splittedNode, 0, motion));
    const { container } = render(<>{result.current}</>);

    const p = container.querySelector('p');
    const spans = p?.querySelectorAll('span') ?? [];

    expect(p).toBeInTheDocument();
    expect(spans).toHaveLength(5);
    expect(
      Array.from(spans)
        .map(s => s.textContent)
        .join('')
    ).toBe('Hello');
  });

  it('handles React element without children', () => {
    const { splittedNode } = splitNodeAndExtractText(<span />, split);
    const { result } = renderHook(() => useAnimatedNode(splittedNode, 0, motion));
    const { container } = render(<>{result.current}</>);

    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('');
  });

  it('handles unknown node types gracefully', () => {
    const { splittedNode } = splitNodeAndExtractText([null, true] as any, split);
    const { result } = renderHook(() => useAnimatedNode(splittedNode, 0, motion));
    const { container } = render(<>{result.current}</>);

    expect(container.textContent).toBe('');
  });

  it('splits by word when split type is "word"', () => {
    const spans = renderAnimatedNode('Hello World', 'word', motion);

    expect(spans).toHaveLength(3);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['Hello', ' ', 'World']);
  });

  it('returns unknown node types as-is', () => {
    const unknownNode = Symbol('unknown');
    const { result } = renderHook(() => useAnimatedNode([unknownNode as any], 0, {}));

    expect(result.current).toEqual([unknownNode]);
  });
});

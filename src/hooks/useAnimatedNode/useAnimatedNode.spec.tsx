import { ReactNode } from 'react';
import { render, renderHook } from '@testing-library/react';

import { AnimationOrder, Motion } from '../../types';
import * as generateAnimationModule from '../../utils/generateAnimation';
import { splitNodeAndExtractText } from '../../utils/splitNodeAndExtractText';

import { useAnimatedNode } from './useAnimatedNode';

const renderAnimatedNode = (
  children: ReactNode,
  split: 'character' | 'word',
  motion: Motion = {},
  initialDelay = 0,
  animationOrder: AnimationOrder = 'first-to-last'
) => {
  const { splittedNode } = splitNodeAndExtractText(children, split);
  const { result } = renderHook(() => useAnimatedNode(splittedNode, initialDelay, animationOrder, motion));
  const { container } = render(<>{result.current}</>);

  return container.querySelectorAll('span');
};

describe('useAnimatedNode hook', () => {
  const split = 'character';
  const motion: Motion = {};

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
    const { result } = renderHook(() => useAnimatedNode(splittedNode, 0, 'first-to-last', motion));
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
    const { result } = renderHook(() => useAnimatedNode(splittedNode, 0, 'first-to-last', motion));
    const { container } = render(<>{result.current}</>);

    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('');
  });

  it('handles unknown node types gracefully', () => {
    const { splittedNode } = splitNodeAndExtractText([null, true] as any, split);
    const { result } = renderHook(() => useAnimatedNode(splittedNode, 0, 'first-to-last', motion));
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
    const { result } = renderHook(() => useAnimatedNode([unknownNode as any], 0, 'first-to-last', motion));

    expect(result.current).toEqual([unknownNode]);
  });
});

describe('useAnimatedNode animationIndex calculation', () => {
  const motion: Motion = {};
  const initialDelay = 0;
  const generateAnimationSpy = jest.spyOn(generateAnimationModule, 'generateAnimation');

  beforeEach(() => {
    generateAnimationSpy.mockClear();
  });

  it('calculates animationIndex in first-to-last order', () => {
    const text = 'ABC';
    const { splittedNode } = splitNodeAndExtractText(text, 'character');

    renderHook(() => useAnimatedNode(splittedNode, initialDelay, 'first-to-last', motion));

    const calls = generateAnimationSpy.mock.calls;

    expect(calls[0][1]).toBe(0);
    expect(calls[1][1]).toBe(1);
    expect(calls[2][1]).toBe(2);
  });

  it('calculates animationIndex in last-to-first order', () => {
    const text = 'ABC';
    const { splittedNode } = splitNodeAndExtractText(text, 'character');

    renderHook(() => useAnimatedNode(splittedNode, initialDelay, 'last-to-first', motion));

    const calls = generateAnimationSpy.mock.calls;

    expect(calls[0][1]).toBe(2);
    expect(calls[1][1]).toBe(1);
    expect(calls[2][1]).toBe(0);
  });
});

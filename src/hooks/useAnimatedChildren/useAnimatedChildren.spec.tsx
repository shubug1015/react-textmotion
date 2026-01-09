import { cloneElement, isValidElement, type ReactNode } from 'react';
import { render, renderHook } from '@testing-library/react';

import type { AnimationOrder, Motion } from '../../types';
import * as generateAnimationModule from '../../utils/generateAnimation';
import { splitNodeAndExtractText } from '../../utils/splitNodeAndExtractText';

import { useAnimatedChildren } from './useAnimatedChildren';

const renderAnimatedNode = (
  children: ReactNode,
  split: 'character' | 'word',
  resolvedMotion: Motion = {},
  initialDelay = 0,
  animationOrder: AnimationOrder = 'first-to-last'
) => {
  const { splittedNode } = splitNodeAndExtractText(children, split);
  const { result } = renderHook(() =>
    useAnimatedChildren({ splittedNode, initialDelay, animationOrder, resolvedMotion })
  );
  const childrenArray = Array.isArray(result.current) ? result.current : [result.current];
  const { container } = render(
    <>{childrenArray.map((child, index) => (isValidElement(child) ? cloneElement(child, { key: index }) : child))}</>
  );

  return container.querySelectorAll('span');
};

describe('useAnimatedChildren hook', () => {
  const split = 'character';
  const resolvedMotion: Motion = {};

  it('generates animated spans for string children', () => {
    const spans = renderAnimatedNode('Hey', split, resolvedMotion);

    expect(spans).toHaveLength(3);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['H', 'e', 'y']);
  });

  it('handles number children', () => {
    const spans = renderAnimatedNode(123, split, resolvedMotion);

    expect(spans).toHaveLength(3);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['1', '2', '3']);
  });

  it('handles empty string gracefully', () => {
    const spans = renderAnimatedNode('', split, resolvedMotion);

    expect(spans).toHaveLength(0);
  });

  it('handles nested React elements with text', () => {
    const { splittedNode } = splitNodeAndExtractText(<p>Hello</p>, split);
    const { result } = renderHook(() =>
      useAnimatedChildren({ splittedNode, initialDelay: 0, animationOrder: 'first-to-last', resolvedMotion })
    );
    const { container } = render(
      <>
        {Array.isArray(result.current)
          ? result.current.map((child: ReactNode, index: number) =>
              isValidElement(child) ? cloneElement(child, { key: index }) : child
            )
          : result.current}
      </>
    );

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
    const { result } = renderHook(() =>
      useAnimatedChildren({ splittedNode, initialDelay: 0, animationOrder: 'first-to-last', resolvedMotion })
    );
    const { container } = render(
      <>
        {Array.isArray(result.current)
          ? result.current.map((child: ReactNode, index: number) =>
              isValidElement(child) ? cloneElement(child, { key: index }) : child
            )
          : result.current}
      </>
    );

    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('');
  });

  it('handles unknown node types gracefully', () => {
    const { splittedNode } = splitNodeAndExtractText([null, true] as any, split);
    const { result } = renderHook(() =>
      useAnimatedChildren({ splittedNode, initialDelay: 0, animationOrder: 'first-to-last', resolvedMotion })
    );
    const { container } = render(
      <>
        {Array.isArray(result.current)
          ? result.current.map((child: ReactNode, index: number) =>
              isValidElement(child) ? cloneElement(child, { key: index }) : child
            )
          : result.current}
      </>
    );

    expect(container.textContent).toBe('');
  });

  it('splits by word when split type is "word"', () => {
    const spans = renderAnimatedNode('Hello World', 'word', resolvedMotion);

    expect(spans).toHaveLength(3);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['Hello', ' ', 'World']);
  });

  it('returns unknown node types as-is', () => {
    const unknownNode = Symbol('unknown');
    const { result } = renderHook(() =>
      useAnimatedChildren({
        splittedNode: [unknownNode as any],
        initialDelay: 0,
        animationOrder: 'first-to-last',
        resolvedMotion,
      })
    );

    expect(result.current).toEqual([unknownNode]);
  });
});

describe('useAnimatedChildren animationIndex calculation', () => {
  const initialDelay = 0;
  const resolvedMotion: Motion = {};
  const generateAnimationSpy = jest.spyOn(generateAnimationModule, 'generateAnimation');

  beforeEach(() => {
    generateAnimationSpy.mockClear();
  });

  it('calculates animationIndex in first-to-last order', () => {
    const text = 'ABC';
    const { splittedNode } = splitNodeAndExtractText(text, 'character');

    renderHook(() =>
      useAnimatedChildren({ splittedNode, initialDelay, animationOrder: 'first-to-last', resolvedMotion })
    );

    const calls = generateAnimationSpy.mock.calls;

    expect(calls[0][1]).toBe(0);
    expect(calls[1][1]).toBe(1);
    expect(calls[2][1]).toBe(2);
  });

  it('calculates animationIndex in last-to-first order', () => {
    const text = 'ABC';
    const { splittedNode } = splitNodeAndExtractText(text, 'character');

    renderHook(() =>
      useAnimatedChildren({ splittedNode, initialDelay, animationOrder: 'last-to-first', resolvedMotion })
    );

    const calls = generateAnimationSpy.mock.calls;

    expect(calls[0][1]).toBe(2);
    expect(calls[1][1]).toBe(1);
    expect(calls[2][1]).toBe(0);
  });
});

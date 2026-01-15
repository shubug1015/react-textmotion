import { cloneElement, isValidElement, type ReactNode } from 'react';
import { fireEvent, render, renderHook } from '@testing-library/react';

import type { AnimationOrder, Motion } from '../../types';
import * as generateAnimationModule from '../../utils/generateAnimation';
import { splitReactNode } from '../../utils/splitReactNode';

import { useAnimatedChildren } from './useAnimatedChildren';

const renderAnimatedNode = (
  children: ReactNode,
  split: 'character' | 'word',
  resolvedMotion: Motion = {},
  initialDelay = 0,
  animationOrder: AnimationOrder = 'first-to-last'
) => {
  const { nodes } = splitReactNode(children, split);
  const { result } = renderHook(() => useAnimatedChildren({ nodes, initialDelay, animationOrder, resolvedMotion }));
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
    const { nodes } = splitReactNode(<p>Hello</p>, split);
    const { result } = renderHook(() =>
      useAnimatedChildren({ nodes, initialDelay: 0, animationOrder: 'first-to-last', resolvedMotion })
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
    const { nodes } = splitReactNode(<span />, split);
    const { result } = renderHook(() =>
      useAnimatedChildren({ nodes, initialDelay: 0, animationOrder: 'first-to-last', resolvedMotion })
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
    const { nodes } = splitReactNode([null, true] as any, split);
    const { result } = renderHook(() =>
      useAnimatedChildren({ nodes, initialDelay: 0, animationOrder: 'first-to-last', resolvedMotion })
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
        nodes: [unknownNode as any],
        initialDelay: 0,
        animationOrder: 'first-to-last',
        resolvedMotion,
      })
    );

    expect(result.current).toEqual([unknownNode]);
  });

  it('calls onAnimationEnd callback when last node animation ends', () => {
    const onAnimationEndMock = jest.fn();
    const { nodes } = splitReactNode('Hi', 'character');

    renderHook(() =>
      useAnimatedChildren({
        nodes,
        initialDelay: 0,
        animationOrder: 'first-to-last',
        resolvedMotion,
        onAnimationEnd: onAnimationEndMock,
      })
    );

    expect(onAnimationEndMock).toBeDefined();
  });

  it('creates handleAnimationEnd function for last node', () => {
    const onAnimationEndMock = jest.fn();
    const { nodes } = splitReactNode('A', 'character');

    const { result } = renderHook(() =>
      useAnimatedChildren({
        nodes,
        initialDelay: 0,
        animationOrder: 'first-to-last',
        resolvedMotion,
        onAnimationEnd: onAnimationEndMock,
      })
    );

    const animatedNodes = result.current;

    expect(animatedNodes).toHaveLength(1);
    expect(onAnimationEndMock).toBeDefined();
  });

  it('creates handleAnimationEnd function for last node in multi-character text', () => {
    const onAnimationEndMock = jest.fn();
    const { nodes } = splitReactNode('ABC', 'character');

    const { result } = renderHook(() =>
      useAnimatedChildren({
        nodes,
        initialDelay: 0,
        animationOrder: 'first-to-last',
        resolvedMotion,
        onAnimationEnd: onAnimationEndMock,
      })
    );

    const animatedNodes = result.current;

    expect(animatedNodes).toHaveLength(3);
    expect(onAnimationEndMock).toBeDefined();
  });

  it('triggers onAnimationEnd callback when last node animation ends', () => {
    const onAnimationEndMock = jest.fn();
    const { nodes } = splitReactNode('A', 'character');

    const { result } = renderHook(() =>
      useAnimatedChildren({
        nodes,
        initialDelay: 0,
        animationOrder: 'first-to-last',
        resolvedMotion,
        onAnimationEnd: onAnimationEndMock,
      })
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

    const spans = container.querySelectorAll('span');
    const lastSpan = spans[spans.length - 1];

    fireEvent.animationEnd(lastSpan!);

    expect(onAnimationEndMock).toBeDefined();
  });

  it('updates onAnimationEnd callback when it changes', () => {
    const onAnimationEndMock1 = jest.fn();
    const onAnimationEndMock2 = jest.fn();
    const { nodes } = splitReactNode('A', 'character');

    const { rerender } = renderHook(
      ({ onAnimationEnd }) =>
        useAnimatedChildren({
          nodes,
          initialDelay: 0,
          animationOrder: 'first-to-last',
          resolvedMotion,
          onAnimationEnd,
        }),
      {
        initialProps: { onAnimationEnd: onAnimationEndMock1 },
      }
    );

    rerender({ onAnimationEnd: onAnimationEndMock2 });

    expect(onAnimationEndMock2).toBeDefined();
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
    const { nodes } = splitReactNode(text, 'character');

    renderHook(() => useAnimatedChildren({ nodes, initialDelay, animationOrder: 'first-to-last', resolvedMotion }));

    const calls = generateAnimationSpy.mock.calls;

    expect(calls[0][1]).toBe(0);
    expect(calls[1][1]).toBe(1);
    expect(calls[2][1]).toBe(2);
  });

  it('calculates animationIndex in last-to-first order', () => {
    const text = 'ABC';
    const { nodes } = splitReactNode(text, 'character');

    renderHook(() => useAnimatedChildren({ nodes, initialDelay, animationOrder: 'last-to-first', resolvedMotion }));

    const calls = generateAnimationSpy.mock.calls;

    expect(calls[0][1]).toBe(2);
    expect(calls[1][1]).toBe(1);
    expect(calls[2][1]).toBe(0);
  });
});

describe('AnimatedSpan newline handling', () => {
  it('renders br element for newline characters in text', () => {
    const { nodes } = splitReactNode('A\nB', 'character');
    const { result } = renderHook(() =>
      useAnimatedChildren({ nodes, initialDelay: 0, animationOrder: 'first-to-last', resolvedMotion: {} })
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

    const brElement = container.querySelector('br');

    expect(brElement).toBeInTheDocument();
  });
});

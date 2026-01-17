import { cloneElement, isValidElement, type ReactNode } from 'react';
import { fireEvent, render, renderHook } from '@testing-library/react';

import type { AnimationOrder, Motion } from '../../types';
import { splitReactNode } from '../../utils/splitReactNode';

import { useAnimateChildren } from './useAnimateChildren';

const renderAnimatedHook = (
  nodes: ReactNode[],
  options?: {
    initialDelay?: number;
    animationOrder?: AnimationOrder;
    motion?: Motion;
    onAnimationEnd?: () => void;
  }
) => {
  const { initialDelay = 0, animationOrder = 'first-to-last', motion = {}, onAnimationEnd } = options ?? {};

  const hookResult = renderHook(() =>
    useAnimateChildren({
      nodes,
      initialDelay,
      animationOrder,
      motion,
      onAnimationEnd,
    })
  );

  const elements = Array.isArray(hookResult.result.current) ? hookResult.result.current : [hookResult.result.current];

  const renderResult = render(
    <>{elements.map((child, index) => (isValidElement(child) ? cloneElement(child, { key: index }) : child))}</>
  );

  return {
    ...renderResult,
    spans: renderResult.container.querySelectorAll('span'),
  };
};

describe('useAnimateChildren', () => {
  const split = 'character';
  const motion: Motion = {};

  it('creates AnimatedSpan elements for string children', () => {
    const { nodes } = splitReactNode('Hey', split);
    const { spans } = renderAnimatedHook(nodes);

    expect(spans).toHaveLength(3);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['H', 'e', 'y']);
  });

  it('handles number children correctly', () => {
    const { nodes } = splitReactNode(123, split);
    const { spans } = renderAnimatedHook(nodes);

    expect(spans).toHaveLength(3);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['1', '2', '3']);
  });

  it('returns empty result for empty string', () => {
    const { nodes } = splitReactNode('', split);
    const { spans } = renderAnimatedHook(nodes);

    expect(spans).toHaveLength(0);
  });

  it('preserves nested React element structure', () => {
    const { nodes } = splitReactNode(<p>Hello</p>, split);
    const { container } = renderAnimatedHook(nodes);

    const paragraph = container.querySelector('p');
    const spans = paragraph?.querySelectorAll('span') ?? [];

    expect(paragraph).toBeInTheDocument();
    expect(
      Array.from(spans)
        .map(s => s.textContent)
        .join('')
    ).toBe('Hello');
  });

  it('returns unknown node types as-is', () => {
    const unknownNode = Symbol('unknown');
    const { result } = renderHook(() =>
      useAnimateChildren({
        nodes: [unknownNode as any],
        initialDelay: 0,
        animationOrder: 'first-to-last',
        motion: {},
      })
    );

    expect(result.current).toEqual([unknownNode]);
  });

  it('splits text by word when split type is "word"', () => {
    const { nodes } = splitReactNode('Hello World', 'word');
    const { spans } = renderAnimatedHook(nodes);

    expect(Array.from(spans).map(s => s.textContent)).toEqual(['Hello', ' ', 'World']);
  });

  // it('renders <br /> for newline characters', () => {
  //   const { nodes } = splitReactNode('A\nB', split);
  //   const { container } = renderAnimatedHook(nodes);

  //   expect(container.querySelector('br')).toBeInTheDocument();
  // });

  it('calls onAnimationEnd only when the last animation ends', () => {
    const onAnimationEnd = jest.fn();
    const { nodes } = splitReactNode('ABC', split);

    const { spans } = renderAnimatedHook(nodes, { onAnimationEnd });

    fireEvent.animationEnd(spans[0]);
    fireEvent.animationEnd(spans[1]);

    expect(onAnimationEnd).not.toHaveBeenCalled();

    fireEvent.animationEnd(spans[2]);

    expect(onAnimationEnd).toHaveBeenCalledTimes(1);
  });

  it('updates onAnimationEnd callback when it changes', () => {
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const { nodes } = splitReactNode('A', split);

    const { rerender } = renderHook(
      ({ onAnimationEnd }) =>
        useAnimateChildren({
          nodes,
          initialDelay: 0,
          animationOrder: 'first-to-last',
          motion,
          onAnimationEnd,
        }),
      {
        initialProps: { onAnimationEnd: firstCallback },
      }
    );

    rerender({ onAnimationEnd: secondCallback });

    expect(secondCallback).not.toHaveBeenCalled();
  });
});

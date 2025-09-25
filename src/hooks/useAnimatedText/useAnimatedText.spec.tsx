import { fireEvent, render, renderHook } from '@testing-library/react';

import type { Motion } from '../../types';
import * as generateAnimationModule from '../../utils/generateAnimation';

import { useAnimatedText } from './useAnimatedText';

jest.mock('../../components/AnimatedSpan', () => ({
  AnimatedSpan: ({
    text,
    onAnimationEnd,
  }: {
    text: string;
    style: React.CSSProperties;
    onAnimationEnd?: () => void;
  }) => (
    <span data-testid="animated-span" onAnimationEnd={onAnimationEnd}>
      {text}
    </span>
  ),
}));

describe('useAnimatedText hook', () => {
  const resolvedMotion: Motion = {};
  const initialDelay = 0;

  it('renders one span per splittedText character', () => {
    const splittedText = ['H', 'i'];

    const { result } = renderHook(() =>
      useAnimatedText({
        splittedText,
        initialDelay,
        animationOrder: 'first-to-last',
        resolvedMotion,
      })
    );

    const { container } = render(<>{result.current}</>);
    const spans = container.querySelectorAll('[data-testid="animated-span"]');

    expect(spans).toHaveLength(2);
    expect(Array.from(spans).map(s => s.textContent)).toEqual(['H', 'i']);
  });

  it('attaches onAnimationEnd only to the last element', () => {
    const splittedText = ['A', 'B', 'C'];
    const handleEnd = jest.fn();

    const { result } = renderHook(() =>
      useAnimatedText({
        splittedText,
        initialDelay,
        animationOrder: 'first-to-last',
        resolvedMotion,
        onAnimationEnd: handleEnd,
      })
    );

    const { container } = render(<>{result.current}</>);
    const spans = container.querySelectorAll('[data-testid="animated-span"]');

    fireEvent.animationEnd(spans[2]);
    expect(handleEnd).toHaveBeenCalled();

    fireEvent.animationEnd(spans[0]);
    fireEvent.animationEnd(spans[1]);
    expect(handleEnd).toHaveBeenCalledTimes(1);
  });

  it('handles last-to-first order correctly', () => {
    const splittedText = ['X', 'Y', 'Z'];
    const handleEnd = jest.fn();

    const { result } = renderHook(() =>
      useAnimatedText({
        splittedText,
        initialDelay,
        animationOrder: 'last-to-first',
        resolvedMotion,
        onAnimationEnd: handleEnd,
      })
    );

    const { container } = render(<>{result.current}</>);
    const spans = container.querySelectorAll('[data-testid="animated-span"]');

    fireEvent.animationEnd(spans[0]);
    expect(handleEnd).toHaveBeenCalled();
  });
});

describe('useAnimatedText animationIndex calculation', () => {
  const resolvedMotion: Motion = {};
  const initialDelay = 0;
  const generateAnimationSpy = jest.spyOn(generateAnimationModule, 'generateAnimation');

  beforeEach(() => {
    generateAnimationSpy.mockClear();
  });

  it('calculates animationIndex in first-to-last order', () => {
    const splittedText = ['A', 'B', 'C'];

    renderHook(() =>
      useAnimatedText({
        splittedText,
        initialDelay,
        animationOrder: 'first-to-last',
        resolvedMotion,
      })
    );

    const calls = generateAnimationSpy.mock.calls;

    expect(calls[0][1]).toBe(0);
    expect(calls[1][1]).toBe(1);
    expect(calls[2][1]).toBe(2);
  });

  it('calculates animationIndex in last-to-first order', () => {
    const splittedText = ['A', 'B', 'C'];

    renderHook(() =>
      useAnimatedText({
        splittedText,
        initialDelay,
        animationOrder: 'last-to-first',
        resolvedMotion,
      })
    );

    const calls = generateAnimationSpy.mock.calls;

    expect(calls[0][1]).toBe(2);
    expect(calls[1][1]).toBe(1);
    expect(calls[2][1]).toBe(0);
  });
});

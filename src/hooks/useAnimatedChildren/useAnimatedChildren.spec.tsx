import { render, renderHook } from '@testing-library/react';

import { MotionConfig } from '../../types';

import { useAnimatedChildren } from './useAnimatedChildren';

describe('useAnimatedChildren hook', () => {
  const motion: MotionConfig = {};
  const split = 'character';

  it('returns empty array for no children', () => {
    const { result } = renderHook(() => useAnimatedChildren('', motion, split, true));

    expect(result.current).toEqual([]);
  });

  it('generates animated spans for string children', () => {
    const children = 'Hey';
    const { result } = renderHook(() => useAnimatedChildren(children, motion, split, true));

    const { container } = render(<>{result.current}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(children.length);
    expect(Array.from(spans, s => s.textContent)).toEqual([...children]);
  });

  it('handles nested React elements with text', () => {
    const children = <p>Hello</p>;
    const { result } = renderHook(() => useAnimatedChildren(children, motion, split, true));

    const { container } = render(<>{result.current}</>);
    const paragraph = container.querySelector('p') as HTMLElement;
    const spans = paragraph.querySelectorAll('span');

    expect(paragraph).toBeInTheDocument();
    expect(spans.length).toBe('Hello'.length);
  });

  it('resets sequenceIndexRef for each call', () => {
    const children = 'Hi';
    const { result } = renderHook(() => useAnimatedChildren(children, motion, split, true));

    const { container } = render(<>{result.current}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(children.length);
  });

  it('returns original children when not enabled', () => {
    const children = <p>Hello</p>;
    const { result } = renderHook(() => useAnimatedChildren(children, motion, split, false));

    const { container } = render(<>{result.current}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(0);
    expect(container.textContent).toBe('Hello');
  });
});

import { render, renderHook } from '@testing-library/react';

import { AnimationPreset, MotionConfig } from '../../types';

import { useAnimatedNode } from './useAnimatedNode';

describe('useAnimatedNode hook', () => {
  const split = 'character';
  const initialDelay = 0;
  const motion: MotionConfig = {};
  const preset: AnimationPreset[] = [];

  it('generates animated spans for string children', () => {
    const children = 'Hey';
    const { result } = renderHook(() => useAnimatedNode(children, split, initialDelay, motion, preset));

    const { container } = render(<>{result.current}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(children.length);
    expect(Array.from(spans, s => s.textContent)).toEqual([...children]);
  });

  it('handles nested React elements with text', () => {
    const children = <p>Hello</p>;
    const { result } = renderHook(() => useAnimatedNode(children, split, initialDelay, motion, preset));

    const { container } = render(<>{result.current}</>);
    const paragraph = container.querySelector('p') as HTMLElement;
    const spans = paragraph.querySelectorAll('span');

    expect(paragraph).toBeInTheDocument();
    expect(spans.length).toBe('Hello'.length);
  });

  it('resets sequenceIndexRef for each call', () => {
    const children = 'Hi';
    const { result } = renderHook(() => useAnimatedNode(children, split, initialDelay, motion, preset));

    const { container } = render(<>{result.current}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(children.length);
  });
});

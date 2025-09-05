import { render } from '@testing-library/react';

import { MotionConfig } from '../../types';

import { useAnimatedChildren } from './useAnimatedChildren';

describe('useAnimatedChildren hook', () => {
  const motion: MotionConfig = {};
  const split = 'character';

  it('returns empty array for no children', () => {
    const result = useAnimatedChildren('', motion, split);

    expect(result).toEqual([]);
  });

  it('generates animated spans for string children', () => {
    const children = 'Hey';
    const result = useAnimatedChildren(children, motion, split);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(children.length);
    expect(Array.from(spans, s => s.textContent)).toEqual([...children]);
  });

  it('handles nested React elements with text', () => {
    const children = <p>Hello</p>;
    const result = useAnimatedChildren(children, motion, split);

    const { container } = render(<>{result}</>);
    const paragraph = container.querySelector('p') as HTMLElement;
    const spans = paragraph.querySelectorAll('span');

    expect(paragraph).toBeInTheDocument();
    expect(spans.length).toBe('Hello'.length);
  });

  it('resets sequenceIndexRef for each call', () => {
    const children = 'Hi';
    const result = useAnimatedChildren(children, motion, split);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(children.length);
  });
});

import { render } from '@testing-library/react';

import { MotionConfig } from '../../types';

import { useGenerateAnimatedChildren } from './useGenerateAnimatedChildren';

describe('useGenerateAnimatedChildren hook', () => {
  const motion: MotionConfig = {};
  const split = 'character';

  let sequenceIndexRef: { current: number };

  beforeEach(() => {
    sequenceIndexRef = { current: 0 };
  });

  it('returns empty array for no children', () => {
    const result = useGenerateAnimatedChildren('', motion, split, sequenceIndexRef);

    expect(result).toEqual([]);
  });

  it('generates animated spans for string children', () => {
    const children = 'Hey';
    const result = useGenerateAnimatedChildren(children, motion, split, sequenceIndexRef);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(children.length);
    expect(Array.from(spans, s => s.textContent)).toEqual([...children]);
  });

  it('handles nested React elements with text', () => {
    const children = <p>Hello</p>;
    const result = useGenerateAnimatedChildren(children, motion, split, sequenceIndexRef);

    const { container } = render(<>{result}</>);
    const paragraph = container.querySelector('p') as HTMLElement;
    const spans = paragraph.querySelectorAll('span');

    expect(paragraph).toBeInTheDocument();
    expect(spans.length).toBe('Hello'.length);
  });

  it('resets sequenceIndexRef for each call', () => {
    const children = 'Hi';
    const result = useGenerateAnimatedChildren(children, motion, split, sequenceIndexRef);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(children.length);
  });
});

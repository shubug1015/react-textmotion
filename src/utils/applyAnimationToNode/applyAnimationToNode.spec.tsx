import { render } from '@testing-library/react';

import { MotionConfig } from '../../types';

import { applyAnimationToNode } from './applyAnimationToNode';

describe('applyAnimationToNode utility', () => {
  const motion: MotionConfig = {};
  const split = 'character';
  let sequenceIndexRef: { current: number };

  beforeEach(() => {
    sequenceIndexRef = { current: 0 };
  });

  it('splits string into animated spans', () => {
    const node = 'Hi';
    const result = applyAnimationToNode(node, motion, split, sequenceIndexRef);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe('H');
    expect(spans[1].textContent).toBe('i');
  });

  it('splits number into animated spans', () => {
    const node = 123;
    const result = applyAnimationToNode(node, motion, split, sequenceIndexRef);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(3);
    expect(spans[0].textContent).toBe('1');
    expect(spans[1].textContent).toBe('2');
    expect(spans[2].textContent).toBe('3');
  });

  it('recursively handles nested elements', () => {
    const node = <strong>Hello</strong>;
    const result = applyAnimationToNode(node, motion, split, sequenceIndexRef);

    const { container } = render(<>{result}</>);
    const strong = container.querySelector('strong') as HTMLElement;
    const spans = strong.querySelectorAll('span');

    expect(strong).toBeInTheDocument();
    expect(spans.length).toBe('Hello'.length);
  });

  it('handles arrays of nodes', () => {
    const node = ['Hello', ' ', 'World'];
    const result = applyAnimationToNode(node, motion, split, sequenceIndexRef);

    const { container } = render(<>{result}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(11);
  });
});

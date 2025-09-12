import { render } from '@testing-library/react';

import { MotionConfig } from '../../types';

import { applyAnimationToNode } from './applyAnimationToNode';

describe('applyAnimationToNode utility', () => {
  const motion: MotionConfig = {};
  const split = 'character';
  const sequenceIndex = 0;

  it('splits string into animated spans', () => {
    const node = 'Hi';
    const result = applyAnimationToNode(node, motion, split, sequenceIndex);

    const { container } = render(<>{result.nodes}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe('H');
    expect(spans[1].textContent).toBe('i');
    expect(result.nextSequenceIndex).toBe(2);
  });

  it('splits number into animated spans', () => {
    const node = 123;
    const result = applyAnimationToNode(node, motion, split, sequenceIndex);

    const { container } = render(<>{result.nodes}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(3);
    expect(spans[0].textContent).toBe('1');
    expect(spans[1].textContent).toBe('2');
    expect(spans[2].textContent).toBe('3');
    expect(result.nextSequenceIndex).toBe(3);
  });

  it('recursively handles nested elements', () => {
    const node = <strong>Hello</strong>;
    const result = applyAnimationToNode(node, motion, split, sequenceIndex);

    const { container } = render(<>{result.nodes}</>);
    const strong = container.querySelector('strong') as HTMLElement;
    const spans = strong.querySelectorAll('span');

    expect(strong).toBeInTheDocument();
    expect(spans.length).toBe('Hello'.length);
    expect(result.nextSequenceIndex).toBe('Hello'.length + 1);
  });

  it('handles arrays of nodes', () => {
    const node = ['Hello', ' ', 'World'];
    const result = applyAnimationToNode(node, motion, split, sequenceIndex);

    const { container } = render(<>{result.nodes}</>);
    const spans = container.querySelectorAll('span');

    expect(spans.length).toBe(11);
    expect(result.nextSequenceIndex).toBe(11);
  });

  it('handles null and boolean nodes', () => {
    const nullNode = null;
    const booleanNode = true;

    const nullResult = applyAnimationToNode(nullNode, motion, split, sequenceIndex);
    const booleanResult = applyAnimationToNode(booleanNode, motion, split, sequenceIndex);

    expect(nullResult.nodes).toEqual([]);
    expect(nullResult.nextSequenceIndex).toBe(sequenceIndex);

    expect(booleanResult.nodes).toEqual([]);
    expect(booleanResult.nextSequenceIndex).toBe(sequenceIndex);
  });

  it('handles unknown node types by returning the node as-is', () => {
    const unknownNode = Symbol('test');
    const result = applyAnimationToNode(unknownNode as any, {}, 'character', 0);

    expect(result.nodes).toEqual([unknownNode]);
    expect(result.nextSequenceIndex).toBe(0);
  });
});

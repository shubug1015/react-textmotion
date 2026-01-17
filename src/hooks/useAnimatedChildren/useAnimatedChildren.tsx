import { Children, cloneElement, type ReactNode, type RefObject, useEffect, useMemo, useRef } from 'react';

import type { AnimationOrder, Motion } from '../../types';
import { countNodes } from '../../utils/countNodes';
import { generateAnimation } from '../../utils/generateAnimation';
import { calculateSequenceIndex, isLastNode } from '../../utils/sequenceHelpers';
import { isElementWithChildren, isTextNode } from '../../utils/typeGuards';

import { AnimatedSpan } from './AnimatedSpan';

type UseAnimatedChildrenProps = {
  nodes: ReactNode[];
  initialDelay: number;
  animationOrder: AnimationOrder;
  resolvedMotion: Motion;
  onAnimationEnd?: () => void;
};

type WrapResult = {
  nodes: ReactNode[];
  nextSequenceIndex: number;
};

/**
 * @description
 * `useAnimatedChildren` is a custom hook that animates an array of React nodes.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {ReactNode[]} nodes - The array of React nodes to be animated.
 * @param {number} initialDelay - The initial delay before the animation starts, in seconds.
 * @param {AnimationOrder} animationOrder - Defines the order in which the animation sequence is applied. Defaults to `'first-to-last'`.
 * @param {Motion} resolvedMotion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {() => void} onAnimationEnd - Callback function that is called when the animation ends.
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedChildren = ({
  nodes,
  initialDelay,
  animationOrder,
  resolvedMotion,
  onAnimationEnd,
}: UseAnimatedChildrenProps): ReactNode[] => {
  const onAnimationEndRef = useRef(onAnimationEnd);

  useEffect(() => {
    onAnimationEndRef.current = onAnimationEnd;
  }, [onAnimationEnd]);

  const animatedChildren = useMemo(() => {
    const totalNodes = countNodes(nodes);

    const { nodes: animatedNodes } = wrapWithAnimatedSpan(
      nodes,
      0,
      initialDelay,
      animationOrder,
      resolvedMotion,
      totalNodes,
      onAnimationEndRef
    );

    return animatedNodes;
  }, [nodes, initialDelay, animationOrder, resolvedMotion]);

  return animatedChildren;
};

const wrapWithAnimatedSpan = (
  nodes: ReactNode[],
  currentSequenceIndex: number,
  initialDelay: number,
  animationOrder: AnimationOrder,
  resolvedMotion: Motion,
  totalNodes: number,
  onAnimationEndRef?: RefObject<(() => void) | undefined>
): WrapResult => {
  let sequenceIndex = currentSequenceIndex;

  const animatedNodes = nodes.map((node, key) => {
    if (isTextNode(node)) {
      const currentIndex = sequenceIndex++;
      const calculatedSequenceIndex = calculateSequenceIndex(currentIndex, totalNodes, animationOrder);
      const isLast = isLastNode(calculatedSequenceIndex, totalNodes);
      const handleAnimationEnd = isLast ? () => onAnimationEndRef?.current?.() : undefined;
      const { style } = generateAnimation(resolvedMotion, calculatedSequenceIndex, initialDelay);

      return <AnimatedSpan key={key} text={String(node)} style={style} onAnimationEnd={handleAnimationEnd} />;
    }

    if (isElementWithChildren(node)) {
      const childArray = Children.toArray(node.props.children);
      const { nodes: animatedChildren, nextSequenceIndex } = wrapWithAnimatedSpan(
        childArray,
        sequenceIndex,
        initialDelay,
        animationOrder,
        resolvedMotion,
        totalNodes,
        onAnimationEndRef
      );
      sequenceIndex = nextSequenceIndex;

      return cloneElement(node, {
        ...node.props,
        children: animatedChildren,
        key,
      });
    }

    return node;
  });

  return { nodes: animatedNodes, nextSequenceIndex: sequenceIndex };
};

import { Children, cloneElement, type ReactNode, type RefObject, useEffect, useMemo, useRef } from 'react';

import type { AnimationOrder, Motion } from '../../types';
import { countNodes } from '../../utils/countNodes';
import { generateAnimation } from '../../utils/generateAnimation';
import { calculateSequenceIndex, isLastNode } from '../../utils/sequenceHelpers';
import { isElementWithChildren, isTextNode } from '../../utils/typeGuards';

import { AnimatedSpan } from './AnimatedSpan';

type UseAnimatedChildrenParams = {
  nodes: ReactNode[];
  initialDelay: number;
  animationOrder: AnimationOrder;
  motion: Motion;
  onAnimationEnd?: () => void;
};

type AnimateResult = {
  animatedNodes: ReactNode[];
  nextSequenceIndex: number;
};

type AnimateNodeTreeParams = {
  nodes: ReactNode[];
  startSequenceIndex: number;
  totalTextNodeCount: number;
  initialDelay: number;
  animationOrder: AnimationOrder;
  motion: Motion;
  onAnimationEndRef?: RefObject<(() => void) | undefined>;
};

/**
 * @description
 * `useAnimateChildren` is a custom hook that animates an array of React nodes.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {ReactNode[]} nodes - The array of React nodes to be animated.
 * @param {number} initialDelay - The initial delay before the animation starts, in seconds.
 * @param {AnimationOrder} animationOrder - Defines the order in which the animation sequence is applied. Defaults to `'first-to-last'`.
 * @param {Motion} motion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {() => void} onAnimationEnd - Callback function that is called when the animation ends.
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimateChildren = ({
  nodes,
  initialDelay,
  animationOrder,
  motion,
  onAnimationEnd,
}: UseAnimatedChildrenParams): ReactNode[] => {
  const onAnimationEndRef = useRef(onAnimationEnd);

  useEffect(() => {
    onAnimationEndRef.current = onAnimationEnd;
  }, [onAnimationEnd]);

  const animatedChildren = useMemo(() => {
    const totalTextNodeCount = countNodes(nodes);

    const { animatedNodes } = animateNodeTree({
      nodes,
      startSequenceIndex: 0,
      totalTextNodeCount,
      initialDelay,
      animationOrder,
      motion,
      onAnimationEndRef,
    });

    return animatedNodes;
  }, [nodes, initialDelay, animationOrder, motion]);

  return animatedChildren;
};

const animateNodeTree = ({
  nodes,
  startSequenceIndex,
  totalTextNodeCount,
  initialDelay,
  animationOrder,
  motion,
  onAnimationEndRef,
}: AnimateNodeTreeParams): AnimateResult => {
  let sequenceIndex = startSequenceIndex;

  const animatedNodes = nodes.map((node, key) => {
    if (isTextNode(node)) {
      const rawSequenceIndex = sequenceIndex++;
      const orderedSequenceIndex = calculateSequenceIndex(rawSequenceIndex, totalTextNodeCount, animationOrder);
      const shouldTriggerAnimationEnd = isLastNode(orderedSequenceIndex, totalTextNodeCount);

      const { style } = generateAnimation(motion, orderedSequenceIndex, initialDelay);

      return (
        <AnimatedSpan
          key={key}
          text={String(node)}
          style={style}
          onAnimationEnd={shouldTriggerAnimationEnd ? () => onAnimationEndRef?.current?.() : undefined}
        />
      );
    }

    if (isElementWithChildren(node)) {
      const childNodes = Children.toArray(node.props.children);

      const { animatedNodes: animatedChildren, nextSequenceIndex } = animateNodeTree({
        nodes: childNodes,
        startSequenceIndex: sequenceIndex,
        totalTextNodeCount,
        initialDelay,
        animationOrder,
        motion,
        onAnimationEndRef,
      });

      sequenceIndex = nextSequenceIndex;

      return cloneElement(node, {
        ...node.props,
        children: animatedChildren,
        key,
      });
    }

    return node;
  });

  return {
    animatedNodes,
    nextSequenceIndex: sequenceIndex,
  };
};

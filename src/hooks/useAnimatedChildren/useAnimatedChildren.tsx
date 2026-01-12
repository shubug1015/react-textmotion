import { Children, cloneElement, type ReactNode, useMemo } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import type { AnimationOrder, Motion } from '../../types';
import { countNodes } from '../../utils/countNodes';
import { generateAnimation } from '../../utils/generateAnimation';
import { isElementWithChildren, isTextNode } from '../../utils/typeGuards/typeGuards';

type UseAnimatedChildrenProps = {
  splittedNode: ReactNode[];
  initialDelay: number;
  animationOrder: AnimationOrder;
  resolvedMotion: Motion;
  onAnimationEnd?: () => void;
};

/**
 * @description
 * `useAnimatedChildren` is a custom hook that animates an array of React nodes.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {ReactNode[]} splittedNode - The array of React nodes to be animated.
 * @param {number} initialDelay - The initial delay before the animation starts, in seconds.
 * @param {AnimationOrder} animationOrder - Defines the order in which the animation sequence is applied. Defaults to `'first-to-last'`.
 * @param {Motion} resolvedMotion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {() => void} onAnimationEnd - Callback function that is called when the animation ends.
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedChildren = ({
  splittedNode,
  initialDelay,
  animationOrder,
  resolvedMotion,
  onAnimationEnd,
}: UseAnimatedChildrenProps): ReactNode[] => {
  const animatedChildren = useMemo(() => {
    const totalNodes = countNodes(splittedNode);
    const sequenceIndexRef = { current: 0 };

    return wrapWithAnimatedSpan(
      splittedNode,
      initialDelay,
      animationOrder,
      resolvedMotion,
      totalNodes,
      sequenceIndexRef,
      onAnimationEnd
    );
  }, [splittedNode, initialDelay, animationOrder, resolvedMotion, onAnimationEnd]);

  return animatedChildren;
};

const incrementSequenceIndex = (ref: { current: number }): number => {
  const current = ref.current;
  ref.current += 1;
  return current;
};

export const wrapWithAnimatedSpan = (
  splittedNode: ReactNode[],
  initialDelay: number,
  animationOrder: AnimationOrder,
  resolvedMotion: Motion,
  totalNodes: number,
  sequenceIndexRef: { current: number },
  onAnimationEnd?: () => void
): ReactNode[] => {
  return splittedNode.map(node => {
    const currentIndex = incrementSequenceIndex(sequenceIndexRef);
    const sequenceIndex = animationOrder === 'first-to-last' ? currentIndex : totalNodes - currentIndex - 1;

    const isLast = sequenceIndex === totalNodes - 1;
    const handleAnimationEnd = isLast ? onAnimationEnd : undefined;

    if (isTextNode(node)) {
      const { style } = generateAnimation(resolvedMotion, sequenceIndex, initialDelay);

      return <AnimatedSpan key={currentIndex} text={String(node)} style={style} onAnimationEnd={handleAnimationEnd} />;
    }

    if (isElementWithChildren(node)) {
      const childArray = Children.toArray(node.props.children);
      const animatedChildren = wrapWithAnimatedSpan(
        childArray,
        initialDelay,
        animationOrder,
        resolvedMotion,
        totalNodes,
        sequenceIndexRef,
        onAnimationEnd
      );

      return cloneElement(node, { ...node.props, children: animatedChildren, key: currentIndex });
    }

    return node;
  });
};

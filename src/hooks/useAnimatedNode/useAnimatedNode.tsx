import { Children, cloneElement, isValidElement, type ReactNode, useMemo } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import type { AnimationOrder, Motion } from '../../types';
import { generateAnimation } from '../../utils/generateAnimation';

/**
 * @description
 * `useAnimatedNode` is a custom hook that animates an array of React nodes.
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
export const useAnimatedNode = (
  splittedNode: ReactNode[],
  initialDelay: number,
  animationOrder: AnimationOrder,
  resolvedMotion: Motion,
  onAnimationEnd?: () => void
): ReactNode[] => {
  const animatedNode = useMemo(() => {
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

  return animatedNode;
};

const countNodes = (nodes: ReactNode[]): number => {
  return Children.toArray(nodes).reduce((count: number, node: ReactNode) => {
    if (isValidElement<{ children?: ReactNode }>(node)) {
      return count + 1 + countNodes(Children.toArray(node.props.children));
    }

    return count + 1;
  }, 0);
};

export const wrapWithAnimatedSpan = (
  splittedNode: ReactNode[],
  initialDelay: number,
  animationOrder: AnimationOrder,
  resolvedMotion: Motion,
  totalNodes: number,
  sequenceIndexRef?: { current: number },
  onAnimationEnd?: () => void
): ReactNode[] => {
  const lastIndex = animationOrder === 'first-to-last' ? totalNodes - 1 : 0;

  return splittedNode.map(node => {
    const currentIndex = sequenceIndexRef!.current++;
    const animationIndex = animationOrder === 'first-to-last' ? currentIndex : totalNodes - currentIndex - 1;

    const handleAnimationEnd = animationIndex === lastIndex ? onAnimationEnd : undefined;

    if (typeof node === 'string' || typeof node === 'number') {
      return [String(node)].map(text => {
        const { style } = generateAnimation(resolvedMotion, animationIndex, initialDelay);

        return <AnimatedSpan key={currentIndex} text={text} style={style} onAnimationEnd={handleAnimationEnd} />;
      });
    }

    if (isValidElement<{ children?: ReactNode }>(node)) {
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

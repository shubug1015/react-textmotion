import { Children, cloneElement, isValidElement, ReactNode, useMemo } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import { AnimationOrder, MotionConfig } from '../../types';
import { generateAnimation } from '../../utils/generateAnimation';

/**
 * @description
 * `useAnimatedNode` is a custom hook that animates an array of React nodes.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {ReactNode[]} splittedNode - The array of React nodes to be animated.
 * @param {number} initialDelay - The initial delay before the animation starts, in seconds.
 * @param {MotionConfig} resolvedMotion - The motion configuration object, which is a result of merging custom motion and presets.
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedNode = (
  splittedNode: ReactNode[],
  initialDelay: number,
  animationOrder: AnimationOrder,
  resolvedMotion: MotionConfig
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
      sequenceIndexRef
    );
  }, [splittedNode, initialDelay, animationOrder, resolvedMotion]);

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
  resolvedMotion: MotionConfig,
  totalNodes: number,
  sequenceIndexRef?: { current: number }
): ReactNode[] => {
  return splittedNode.map(node => {
    const currentIndex = sequenceIndexRef!.current++;
    const animationIndex = animationOrder === 'last-to-first' ? totalNodes - 1 - currentIndex : currentIndex;

    if (typeof node === 'string' || typeof node === 'number') {
      return [String(node)].map(text => {
        const { style } = generateAnimation(resolvedMotion, animationIndex, initialDelay);

        return <AnimatedSpan key={currentIndex} text={text} style={style} />;
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
        sequenceIndexRef
      );

      return cloneElement(node, { ...node.props, children: animatedChildren, key: currentIndex });
    }

    return node;
  });
};

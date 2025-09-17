import { Children, cloneElement, isValidElement, ReactNode, useMemo } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import { AnimationPreset, MotionConfig, SplitType } from '../../types';
import { splitNode } from '../../utils/splitNode';

/**
 * @description
 * `useAnimatedNode` is a custom hook that traverses through the children of a component,
 * applying animations to them based on the provided motion configuration.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {ReactNode} children - The React children to be animated.
 * @param {SplitType} split - The split type for text animations (`character` or `word`).
 * @param {number} [initialDelay=0] - The initial delay before the animation starts, in seconds. Defaults to `0`.
 * @param {MotionConfig} motion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {AnimationPreset[]} preset - The animation presets to apply.
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedNode = (
  children: ReactNode,
  split: SplitType,
  initialDelay: number,
  motion?: MotionConfig,
  preset?: AnimationPreset[]
): ReactNode[] => {
  return useMemo(() => {
    const childArray = Children.toArray(children ?? []);
    const sequenceIndexRef = { current: 0 };

    return childArray.flatMap(child =>
      wrapWithAnimatedSpan(child, split, initialDelay, motion, preset, sequenceIndexRef)
    );
  }, [children, split, initialDelay, motion, preset]);
};

const wrapWithAnimatedSpan = (
  node: ReactNode,
  split: SplitType,
  initialDelay: number,
  motion?: MotionConfig,
  preset?: AnimationPreset[],
  sequenceIndexRef?: { current: number }
): ReactNode[] => {
  const splittedNodes = splitNode(node, split);

  return splittedNodes.map(node => {
    const currentIndex = sequenceIndexRef!.current++;

    if (typeof node === 'string' || typeof node === 'number') {
      return (
        <AnimatedSpan
          key={currentIndex}
          splittedText={[String(node)]}
          initialDelay={initialDelay}
          motion={motion}
          preset={preset}
          sequenceIndex={currentIndex}
        />
      );
    }

    if (isValidElement<{ children?: ReactNode }>(node)) {
      const animatedChildren = wrapWithAnimatedSpan(
        node.props.children,
        split,
        initialDelay,
        motion,
        preset,
        sequenceIndexRef
      );

      return cloneElement(node, { ...node.props, children: animatedChildren, key: currentIndex });
    }

    return node;
  });
};

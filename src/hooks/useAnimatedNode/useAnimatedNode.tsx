import { Children, cloneElement, isValidElement, ReactNode, useMemo } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import { AnimationPreset, MotionConfig } from '../../types';

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
  splittedNodes: ReactNode[],
  initialDelay: number,
  motion?: MotionConfig,
  preset?: AnimationPreset[]
): ReactNode[] => {
  return useMemo(() => {
    const sequenceIndexRef = { current: 0 };

    return wrapWithAnimatedSpan(splittedNodes, initialDelay, motion, preset, sequenceIndexRef);
  }, [splittedNodes, initialDelay, motion, preset]);
};

export const wrapWithAnimatedSpan = (
  nodes: ReactNode[],
  initialDelay: number,
  motion?: MotionConfig,
  preset?: AnimationPreset[],
  sequenceIndexRef?: { current: number }
): ReactNode[] => {
  return nodes.map(node => {
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
      const childArray = Children.toArray(node.props.children);
      const animatedChildren = wrapWithAnimatedSpan(childArray, initialDelay, motion, preset, sequenceIndexRef);

      return cloneElement(node, { ...node.props, children: animatedChildren, key: currentIndex });
    }

    return node;
  });
};

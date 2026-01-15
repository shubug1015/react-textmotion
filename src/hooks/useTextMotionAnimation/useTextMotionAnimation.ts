import { useMemo } from 'react';

import type { TextMotionProps } from '../../types';
import { splitReactNode } from '../../utils/splitReactNode';
import { useAnimatedChildren } from '../useAnimatedChildren';
import { useIntersectionObserver } from '../useIntersectionObserver';
import { useResolvedMotion } from '../useResolvedMotion';

/**
 * @description
 * `useTextMotionAnimation` is a custom hook that animates the children of the TextMotion component.
 * It returns the animated children, the target reference, and the text.
 *
 * @param {TextMotionProps} props - The props of the TextMotion component.
 * @returns {Object} An object containing the animated children, the target reference, and the text.
 */
export const useTextMotionAnimation = (props: TextMotionProps) => {
  const {
    children,
    split = 'character',
    trigger = 'scroll',
    repeat = true,
    initialDelay = 0,
    animationOrder = 'first-to-last',
    motion,
    preset,
    onAnimationEnd,
  } = props;

  const [targetRef, isIntersecting] = useIntersectionObserver({ repeat });
  const shouldAnimate = trigger === 'on-load' || isIntersecting;

  const { nodes, text } = useMemo(() => splitReactNode(children, split), [children, split]);

  const resolvedMotion = useResolvedMotion({ motion, preset });

  const animatedChildren = useAnimatedChildren({
    nodes: shouldAnimate ? nodes : [children],
    initialDelay,
    animationOrder,
    resolvedMotion,
    onAnimationEnd,
  });

  return {
    shouldAnimate,
    targetRef,
    animatedChildren,
    text,
  };
};

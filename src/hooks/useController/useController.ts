import { type ReactNode, type RefCallback, useMemo } from 'react';

import type { TextMotionProps } from '../../types';
import { splitReactNode } from '../../utils/splitReactNode';
import { useAnimateChildren } from '../useAnimateChildren';
import { useIntersectionObserver } from '../useIntersectionObserver';
import { useResolveMotion } from '../useResolveMotion';

type UseControllerResult = {
  canAnimate: boolean;
  targetRef: RefCallback<Element | null>;
  animatedChildren: ReactNode[];
  text: string;
};

/**
 * @description
 * `useController` orchestrates the full animation flow for TextMotion.
 *
 * Responsibilities:
 * - Determines whether animation should run based on trigger strategy
 * - Splits ReactNode children into animatable units
 * - Resolves motion configuration (preset + custom)
 * - Delegates animation rendering to `useAnimateChildren`
 *
 * @param {TextMotionProps} props - Props passed from the TextMotion component
 * @returns {UseControllerResult}
 */
export const useController = (props: TextMotionProps): UseControllerResult => {
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

  const isScrollTriggered = trigger === 'scroll';
  const canAnimate = !isScrollTriggered || isIntersecting;

  const { nodes: splitNodes, text } = useMemo(() => splitReactNode(children, split), [children, split]);

  const resolvedMotion = useResolveMotion({ motion, preset });

  const animationNodes = canAnimate ? splitNodes : [children];

  const animatedChildren = useAnimateChildren({
    nodes: animationNodes,
    initialDelay,
    animationOrder,
    motion: resolvedMotion,
    onAnimationEnd,
  });

  return {
    canAnimate,
    targetRef,
    animatedChildren,
    text,
  };
};

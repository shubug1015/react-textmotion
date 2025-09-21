import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { FC, memo } from 'react';

import { useAnimatedNode } from '../../hooks/useAnimatedNode';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useResolvedMotion } from '../../hooks/useResolvedMotion';
import { useValidation } from '../../hooks/useValidation';
import { NodeMotionProps } from '../../types';
import { splitNodeAndExtractText } from '../../utils/splitNodeAndExtractText';

/**
 * @description
 * `NodeMotion` is a component that animates its children by applying motion presets or custom motion configurations.
 * It can animate text nodes by splitting them into characters or words, and can also animate other React elements.
 *
 * @param {ElementType} [as='span'] - The HTML tag to render. Defaults to `span`.
 * @param {ReactNode} children - The content to animate. Can be a string, a number, or any React element.
 * @param {SplitType} [split='character'] - Defines how the text is split for animation (`character` or `word`). Defaults to `'character'`.
 * @param {'on-load' | 'scroll'} [trigger='scroll'] - Defines when the animation should start. 'on-load' starts the animation immediately. 'scroll' starts the animation only when the component enters the viewport. Defaults to `'scroll'`.
 * @param {boolean} [repeat=true] - Determines if the animation should repeat every time it enters the viewport. Only applicable when `trigger` is `'scroll'`. Defaults to `true`.
 * @param {number} [initialDelay=0] - The initial delay before the animation starts, in seconds. Defaults to `0`.
 * @param {'first-to-last' | 'last-to-first'} [animationOrder='first-to-last'] - Defines the order in which the animation sequence is applied. Defaults to `'first-to-last'`.
 * @param {MotionConfig} [motion] - Custom motion configuration object. Cannot be used with `preset`.
 * @param {AnimationPreset[]} [preset] - Predefined motion presets. Cannot be used with `motion`.
 *
 * @returns {JSX.Element} A React element that renders animated children.
 *
 * @example
 * // Using custom motion configuration with text
 * function App() {
 *   return (
 *     <NodeMotion
 *       split="character"
 *       trigger="scroll"
 *       repeat={false}
 *       initialDelay={1}
 *       animationOrder="first-to-last"
 *       motion={{
 *         fade: { variant: 'in', duration: 0.25, delay: 0.025, easing: 'linear' },
 *         slide: { variant: 'up', duration: 0.25, delay: 0.025, easing: 'linear' },
 *       }}
 *     >
 *       Hello <strong>World</strong>
 *     </NodeMotion>
 *   );
 * }
 *
 * @example
 * // Using predefined animation presets with mixed children
 * function App() {
 *   return (
 *     <NodeMotion
 *       split="word"
 *       trigger="on-load"
 *       initialDelay={0.5}
 *       animationOrder="first-to-last"
 *       preset={['fade-in', 'slide-up']}
 *     >
 *       <span>Hello</span> <b>World!</b>
 *     </NodeMotion>
 *   );
 * }
 */
export const NodeMotion: FC<NodeMotionProps> = memo(props => {
  const {
    as: Tag = 'span',
    children,
    split = 'character',
    trigger = 'scroll',
    repeat = true,
    initialDelay = 0,
    animationOrder = 'first-to-last',
    motion,
    preset,
  } = props;

  useValidation('NodeMotion', props);

  const [targetRef, isIntersecting] = useIntersectionObserver<HTMLSpanElement>({ repeat });
  const shouldAnimate = trigger === 'on-load' || isIntersecting;

  const { splittedNode, text } = splitNodeAndExtractText(children, split);
  const resolvedMotion = useResolvedMotion(motion, preset);
  const animatedNode = useAnimatedNode(splittedNode, initialDelay, animationOrder, resolvedMotion);

  return (
    <Tag ref={targetRef} className="node-motion" aria-label={text}>
      {shouldAnimate ? animatedNode : children}
    </Tag>
  );
});

import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { Children, FC, memo } from 'react';

import { useAnimatedChildren } from '../../hooks/useAnimatedChildren';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useTextFromReactNode } from '../../hooks/useTextFromReactNode';
import { NodeMotionProps } from '../../types';
import { handleValidation, validateNodeMotionProps } from '../../utils/validation';

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
 *       preset={['fade-in', 'slide-up']}
 *     >
 *       <span>Hello</span> <b>World!</b>
 *     </NodeMotion>
 *   );
 * }
 */
export const NodeMotion: FC<NodeMotionProps> = memo(props => {
  const { as: Tag = 'span', children, split = 'character', trigger = 'scroll', motion, preset, repeat = true } = props;

  const { errors, warnings } = validateNodeMotionProps(props);
  handleValidation(errors, warnings);

  const [targetRef, isIntersecting] = useIntersectionObserver<HTMLSpanElement>({ repeat });
  const shouldAnimate = trigger === 'on-load' || isIntersecting;

  const accessibleText = useTextFromReactNode(children);
  const animatedChildren = useAnimatedChildren(children, split, motion, preset);

  return (
    <Tag ref={targetRef} className="node-motion" aria-label={accessibleText}>
      {shouldAnimate ? Children.toArray(animatedChildren) : children}
    </Tag>
  );
});

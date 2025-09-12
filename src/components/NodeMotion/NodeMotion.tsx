import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { Children, FC, memo } from 'react';

import { useAnimatedChildren, useIntersectionObserver, useResolvedMotion, useTextFromReactNode } from '../../hooks';
import { NodeMotionProps } from '../../types';
import { handleValidation, validateNodeMotionProps } from '../../utils';

/**
 * @description
 * `NodeMotion` is a component that animates its children by applying motion presets or custom motion configurations.
 * It can animate text nodes by splitting them into characters or words, and can also animate other React elements.
 *
 * @param {ElementType} [as='span'] - The HTML tag to render. Defaults to `span`.
 * @param {ReactNode} children - The content to animate. Can be a string, a number, or any React element.
 * @param {SplitType} [split='character'] - Defines how the text is split for animation (`character` or `word`). Defaults to `'character'`.
 * @param {'on-load' | 'scroll'} [trigger='on-load'] - Defines when the animation should start. 'on-load' starts the animation immediately. 'scroll' starts the animation only when the component enters the viewport. Defaults to `'on-load'`.
 * @param {MotionConfig} [motion] - Custom motion configuration object. Cannot be used with `preset`.
 * @param {AnimationPreset[]} [preset] - Predefined motion presets. Cannot be used with `motion`.
 *
 * @returns {JSX.Element} A React element that renders animated children.
 *
 * @example
 * // Using scroll trigger with mixed children
 * function App() {
 *   return (
 *     <NodeMotion
 *       trigger="scroll"
 *       split="word"
 *       preset={['fade-in', 'slide-up']}
 *     >
 *       <span>Hello</span> <b>World!</b>
 *     </NodeMotion>
 *   );
 * }
 */
export const NodeMotion: FC<NodeMotionProps> = memo(props => {
  const { as: Tag = 'span', children, split = 'character', trigger = 'on-load', motion, preset } = props;

  const { errors, warnings } = validateNodeMotionProps(props);
  handleValidation(errors, warnings);

  const [targetRef, isIntersecting] = useIntersectionObserver<HTMLSpanElement>();
  const shouldAnimate = trigger === 'on-load' || isIntersecting;

  const accessibleText = useTextFromReactNode(children);
  const resolvedMotion = useResolvedMotion(motion, preset);
  const animatedChildren = useAnimatedChildren(children, resolvedMotion, split, shouldAnimate);

  return (
    <Tag ref={targetRef} className="node-motion" aria-label={accessibleText}>
      {Children.toArray(animatedChildren)}
    </Tag>
  );
});

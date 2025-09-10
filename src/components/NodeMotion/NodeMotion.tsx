import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { Children, FC, memo } from 'react';

import { useAnimatedChildren, useResolvedMotion, useTextFromReactNode } from '../../hooks';
import { NodeMotionProps } from '../../types';

/**
 * @description
 * `NodeMotion` is a component that animates its children by applying motion presets or custom motion configurations.
 * It can animate text nodes by splitting them into characters or words, and can also animate other React elements.
 *
 * @param {ElementType} [as='span'] - The HTML tag to render. Defaults to `span`.
 * @param {ReactNode} children - The content to animate. Can be a string, a number, or any React element.
 * @param {SplitType} [split='character'] - Defines how the text is split for animation (`character` or `word`). Defaults to `'character'`.
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
 *       preset={['fade-in', 'slide-up']}
 *     >
 *       <span>Hello</span> <b>World!</b>
 *     </NodeMotion>
 *   );
 * }
 */
export const NodeMotion: FC<NodeMotionProps> = memo(
  ({ as: Tag = 'span', children, split = 'character', motion, preset }) => {
    const accessibleText = useTextFromReactNode(children);
    const resolvedMotion = useResolvedMotion(motion, preset);
    const animatedChildren = useAnimatedChildren(children, resolvedMotion, split);

    return (
      <Tag className="motion" aria-label={accessibleText}>
        {Children.toArray(animatedChildren)}
      </Tag>
    );
  }
);

import { FC, memo } from 'react';

import { useResolvedMotion } from '../../hooks';
import { TextMotionProps } from '../../types';
import { createAnimatedSpan, handleValidationErrors, splitText, validateTextMotionProps } from '../../utils';

/**
 * @description
 * `TextMotion` is a component that animates text by splitting it into characters, words or lines,
 * and applying motion presets or custom motion configurations.
 * It leverages CSS animations and dynamically generated inline styles for smooth effects.
 *
 * @param {ElementType} [as='span'] - The HTML tag to render. Defaults to `span`.
 * @param {string} text - The text content to animate.
 * @param {SplitType} [split='character'] - Defines how the text is split for animation (`character`, `word`, or `line`). Defaults to `'character'`.
 * @param {MotionConfig} [motion] - Custom motion configuration object. Cannot be used with `preset`.
 * @param {AnimationPreset[]} [preset] - Predefined motion presets. Cannot be used with `motion`.
 *
 * @returns {JSX.Element} A React element that renders animated `<span>`s for each split unit of text.
 *
 * @example
 * // Using custom motion configuration
 * function App() {
 *   return (
 *     <TextMotion
 *       text="Hello World!"
 *       split="character"
 *       motion={{
 *         fade: { variant: 'in', duration: 0.25, delay: 0.025, easing: 'linear' },
 *         slide: { variant: 'up', duration: 0.25, delay: 0.025, easing: 'linear' },
 *       }}
 *     />
 *   );
 * }
 *
 * @example
 * // Using predefined animation presets
 * function App() {
 *   return (
 *     <TextMotion
 *       text="Hello World!"
 *       split="word"
 *       preset={['fade-in', 'slide-up']}
 *     />
 *   );
 * }
 */

export const TextMotion: FC<TextMotionProps> = memo(props => {
  const { as: Tag = 'span', text, split = 'character', motion, preset } = props;

  const { errors, warnings } = validateTextMotionProps(props);
  handleValidationErrors(errors, warnings);

  const splittedTexts = splitText(text, split);
  const resolvedMotion = useResolvedMotion(motion, preset);

  return (
    <Tag className="motion" aria-label={text}>
      {splittedTexts.map((splittedText, index) => createAnimatedSpan(splittedText, index, resolvedMotion))}
    </Tag>
  );
});

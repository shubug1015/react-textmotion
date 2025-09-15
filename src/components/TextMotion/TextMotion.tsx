import { FC, memo } from 'react';

import { useIntersectionObserver, useResolvedMotion } from '../../hooks';
import { TextMotionProps } from '../../types';
import { createAnimatedSpan, handleValidation, splitText, validateTextMotionProps } from '../../utils';

/**
 * @description
 * `TextMotion` is a component that animates text by splitting it into characters, words or lines,
 * and applying motion presets or custom motion configurations.
 * It leverages CSS animations and dynamically generated inline styles for smooth effects.
 *
 * @param {ElementType} [as='span'] - The HTML tag to render. Defaults to `span`.
 * @param {string} text - The text content to animate.
 * @param {SplitType} [split='character'] - Defines how the text is split for animation (`character`, `word`, or `line`). Defaults to `'character'`.
 * @param {'on-load' | 'scroll' } [trigger='scroll'] - Defines when the animation should start. 'on-load' starts the animation immediately. 'scroll' starts the animation only when the component enters the viewport. Defaults to `'scroll'`.
 * @param {MotionConfig} [motion] - Custom motion configuration object. Cannot be used with `preset`.
 * @param {AnimationPreset[]} [preset] - Predefined motion presets. Cannot be used with `motion`.
 *
 * @returns {JSX.Element} A React element that renders animated `<span>`s for each split unit of text.
 *
 * @example
 * // Using scroll trigger
 * function App() {
 *   return (
 *     <TextMotion
 *       text="Hello World!"
 *       trigger="scroll"
 *       preset={['fade-in', 'slide-up']}
 *     />
 *   );
 * }
 */

export const TextMotion: FC<TextMotionProps> = memo(props => {
  const {
    as: Tag = 'span',
    text,
    split = 'character',
    trigger = 'scroll',
    motion,
    preset,
    repeat = trigger === 'scroll',
  } = props;

  const { errors, warnings } = validateTextMotionProps(props);
  handleValidation(errors, warnings);

  const [targetRef, isIntersecting] = useIntersectionObserver<HTMLSpanElement>();
  const shouldAnimate = trigger === 'on-load' || isIntersecting;

  const resolvedMotion = useResolvedMotion(motion, preset);

  return (
    <Tag ref={targetRef} className="text-motion" aria-label={text}>
      {shouldAnimate
        ? splitText(text, split).map((splittedText, index) => createAnimatedSpan(splittedText, index, resolvedMotion))
        : text}
    </Tag>
  );
});

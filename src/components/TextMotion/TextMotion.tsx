import { FC, memo } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useResolvedMotion } from '../../hooks/useResolvedMotion';
import { TextMotionProps } from '../../types';
import { splitText } from '../../utils/splitText';
import { handleValidation, validateTextMotionProps } from '../../utils/validation';

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
 * @param {boolean} [repeat=true] - Determines if the animation should repeat every time it enters the viewport. Only applicable when `trigger` is `'scroll'`. Defaults to `true`.
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
  const { as: Tag = 'span', text, split = 'character', trigger = 'scroll', motion, preset, repeat = true } = props;

  const { errors, warnings } = validateTextMotionProps(props);
  handleValidation(errors, warnings);

  const [targetRef, isIntersecting] = useIntersectionObserver<HTMLSpanElement>({ repeat });
  const shouldAnimate = trigger === 'on-load' || isIntersecting;

  const resolvedMotion = useResolvedMotion(motion, preset);

  if (shouldAnimate) {
    return (
      <Tag ref={targetRef} className="text-motion" aria-label={text}>
        {splitText(text, split).map((splittedText, index) => (
          <AnimatedSpan key={index} text={splittedText} sequenceIndex={index} motion={resolvedMotion} />
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={targetRef} aria-label={text}>
      {text}
    </Tag>
  );
});

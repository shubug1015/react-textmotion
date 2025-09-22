import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { type FC, memo } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useResolvedMotion } from '../../hooks/useResolvedMotion';
import { useValidation } from '../../hooks/useValidation';
import type { TextMotionProps } from '../../types';
import { generateAnimation } from '../../utils/generateAnimation';
import { splitText } from '../../utils/splitText';

/**
 * @description
 * `TextMotion` is a component that animates text by splitting it into characters, words or lines,
 * and applying motion presets or custom motion configurations.
 * It leverages CSS animations and dynamically generated inline styles for smooth effects.
 *
 * @param {string} text - The text content to animate.
 * @param {ElementType} [as='span'] - The HTML tag to render. Defaults to `span`.
 * @param {Split} [split='character'] - Defines how the text is split for animation (`character`, `word`, or `line`). Defaults to `'character'`.
 * @param {Trigger} [trigger='scroll'] - Defines when the animation should start. 'on-load' starts the animation immediately. 'scroll' starts the animation only when the component enters the viewport. Defaults to `'scroll'`.
 * @param {boolean} [repeat=true] - Determines if the animation should repeat every time it enters the viewport. Only applicable when `trigger` is `'scroll'`. Defaults to `true`.
 * @param {number} [initialDelay=0] - The initial delay before the animation starts, in seconds. Defaults to `0`.
 * @param {'first-to-last' | 'last-to-first'} [animationOrder='first-to-last'] - Defines the order in which the animation sequence is applied. Defaults to `'first-to-last'`.
 * @param {Motion} [motion] - Custom motion configuration object. Cannot be used with `preset`.
 * @param {Preset[]} [preset] - Predefined motion presets. Cannot be used with `motion`.
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
 *       trigger="scroll"
 *       repeat={false}
 *       initialDelay={1}
 *       animationOrder="first-to-last"
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
 *       trigger="on-load"
 *       initialDelay={0.5}
 *       animationOrder="first-to-last"
 *       preset={['fade-in', 'slide-up']}
 *     />
 *   );
 * }
 */
export const TextMotion: FC<TextMotionProps> = memo(props => {
  const {
    text,
    as: Tag = 'span',
    split = 'character',
    trigger = 'scroll',
    repeat = true,
    initialDelay = 0,
    animationOrder = 'first-to-last',
    motion,
    preset,
  } = props;

  useValidation('TextMotion', props);

  const [targetRef, isIntersecting] = useIntersectionObserver<HTMLSpanElement>({ repeat });
  const shouldAnimate = trigger === 'on-load' || isIntersecting;

  const splittedText = splitText(text, split);

  const resolvedMotion = useResolvedMotion(motion, preset);

  const animatedNode = splittedText.map((text, index) => {
    const sequenceIndex = animationOrder === 'first-to-last' ? index : splittedText.length - (index + 1);
    const { style } = generateAnimation(resolvedMotion, sequenceIndex, initialDelay);

    return <AnimatedSpan key={index} text={text} style={style} />;
  });

  return (
    <Tag ref={targetRef} className="text-motion" aria-label={text}>
      {shouldAnimate ? animatedNode : text}
    </Tag>
  );
});

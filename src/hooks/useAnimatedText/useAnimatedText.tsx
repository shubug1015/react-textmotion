import { useMemo } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import type { AnimationOrder, Motion } from '../../types';
import { generateAnimation } from '../../utils/generateAnimation';

type UseAnimatedProps = {
  splittedText: string[];
  initialDelay: number;
  animationOrder: AnimationOrder;
  resolvedMotion: Motion;
  onAnimationEnd?: () => void;
};

/**
 * @description
 * `useAnimatedText` is a custom hook that animates an array of strings.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {string[]} splittedText - The array of strings to be animated.
 * @param {number} initialDelay - The initial delay before the animation starts, in seconds.
 * @param {AnimationOrder} animationOrder - Defines the order in which the animation sequence is applied. Defaults to `'first-to-last'`.
 * @param {Motion} resolvedMotion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {() => void} onAnimationEnd - Callback function that is called when the animation ends.
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedText = ({
  splittedText,
  initialDelay,
  animationOrder,
  resolvedMotion,
  onAnimationEnd,
}: UseAnimatedProps) => {
  const animatedText = useMemo(() => {
    return splittedText.map((text, index) => {
      const sequenceIndex = animationOrder === 'first-to-last' ? index : splittedText.length - (index + 1);

      const isLast = sequenceIndex === splittedText.length - 1;
      const handleAnimationEnd = isLast ? onAnimationEnd : undefined;

      const { style } = generateAnimation(resolvedMotion, sequenceIndex, initialDelay);

      return <AnimatedSpan key={`${text}-${index}`} text={text} style={style} onAnimationEnd={handleAnimationEnd} />;
    });
  }, [splittedText, animationOrder, initialDelay, resolvedMotion, onAnimationEnd]);

  return animatedText;
};

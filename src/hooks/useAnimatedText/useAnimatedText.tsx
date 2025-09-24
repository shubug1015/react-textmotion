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

import { FC } from 'react';

import { useResolvedMotion } from '../../hooks/useResolvedMotion';
import { AnimationPreset, MotionConfig } from '../../types';
import { generateAnimation } from '../../utils/generateAnimation';

type AnimatedSpanProps = {
  splittedText: string[];
  motion?: MotionConfig;
  preset?: AnimationPreset[];
  sequenceIndex?: number;
};

/**
 * @description
 * `AnimatedSpan` is a component that creates a `<span>` element with animation styles.
 *
 * @param {string} splittedText - The array of substrings based on the specified split type.
 * @param {MotionConfig} motion - The motion configuration to generate animation styles from.
 * @param {AnimationPreset[]} preset - The animation presets to apply.
 * @param {number} sequenceIndex - The index of the element in the animation sequence.
 *
 * @returns {JSX.Element} A React element `<span>` with inline animation styles.
 */
export const AnimatedSpan: FC<AnimatedSpanProps> = ({ splittedText, motion, preset, sequenceIndex = 0 }) => {
  const resolvedMotion = useResolvedMotion(motion, preset);

  return splittedText.map((text, index) => {
    const { style } = generateAnimation(resolvedMotion, index + sequenceIndex);

    if (text === '\n') {
      return <br key={`${text}-${index}`} />;
    }

    return (
      <span key={`${text}-${index}`} style={style} aria-hidden="true">
        {text}
      </span>
    );
  });
};

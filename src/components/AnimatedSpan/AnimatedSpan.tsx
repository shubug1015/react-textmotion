import { FC } from 'react';

import { MotionConfig } from '../../types';
import { generateAnimation } from '../../utils/generateAnimation';

type AnimatedSpanProps = {
  text: string;
  sequenceIndex: number;
  motion: MotionConfig;
};

/**
 * @description
 * `AnimatedSpan` is a component that creates a `<span>` element with animation styles.
 *
 * @param {string} text - The text content of the `<span>`.
 * @param {number} sequenceIndex - The index of the element in the animation sequence.
 * @param {MotionConfig} motion - The motion configuration to generate animation styles from.
 *
 * @returns {JSX.Element} A React element `<span>` with inline animation styles.
 */
export const AnimatedSpan: FC<AnimatedSpanProps> = ({ text, sequenceIndex, motion }) => {
  const { style } = generateAnimation(motion, sequenceIndex);

  if (text === '\n') {
    return <br key={sequenceIndex} />;
  }

  return (
    <span key={sequenceIndex} style={style} aria-hidden="true">
      {text}
    </span>
  );
};

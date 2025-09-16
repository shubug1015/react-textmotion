import { FC } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { generateAnimation } from '../../utils/generateAnimation';
import { splitText } from '../../utils/splitText';

type AnimatedSpanProps = {
  text: string;
  split: SplitType;
  motion: MotionConfig;
  sequenceIndex?: number;
};

/**
 * @description
 * `AnimatedSpan` is a component that creates a `<span>` element with animation styles.
 *
 * @param {string} text - The text content of the `<span>`.
 * @param {SplitType} split - The split type for text animations (`character`, `word` or `line`).
 * @param {MotionConfig} motion - The motion configuration to generate animation styles from.
 * @param {number} sequenceIndex - The index of the element in the animation sequence.
 *
 * @returns {JSX.Element} A React element `<span>` with inline animation styles.
 */
export const AnimatedSpan: FC<AnimatedSpanProps> = ({ text, split, motion, sequenceIndex = 0 }) => {
  const splittedTexts = splitText(text, split);

  return splittedTexts.map((splittedText, index) => {
    const { style } = generateAnimation(motion, index + sequenceIndex);

    if (splittedText === '\n') {
      return <br key={index} />;
    }

    return (
      <span key={index} style={style} aria-hidden="true">
        {splittedText}
      </span>
    );
  });
};

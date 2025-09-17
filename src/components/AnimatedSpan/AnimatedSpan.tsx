import { FC } from 'react';

import { MotionConfig } from '../../types';
import { generateAnimation } from '../../utils/generateAnimation';

type AnimatedSpanProps = {
  splittedText: string[];
  initialDelay?: number;
  resolvedMotion: MotionConfig;
  sequenceIndex?: number;
};

/**
 * @description
 * `AnimatedSpan` is a component that creates a `<span>` element with animation styles.
 *
 * @param {string} splittedText - The array of substrings based on the specified split type.
 * @param {number} [initialDelay=0] - The initial delay before the animation starts, in seconds. Defaults to `0`.
 * @param {MotionConfig} resolvedMotion - The motion configuration to generate animation styles from.
 * @param {number} sequenceIndex - The index of the element in the animation sequence.
 *
 * @returns {JSX.Element} A React element `<span>` with inline animation styles.
 */
export const AnimatedSpan: FC<AnimatedSpanProps> = ({
  splittedText,
  initialDelay = 0,
  resolvedMotion,
  sequenceIndex = 0,
}) => {
  return splittedText.map((text, index) => {
    const { style } = generateAnimation(resolvedMotion, index + sequenceIndex, initialDelay);

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

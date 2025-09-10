import { ReactElement } from 'react';

import { MotionConfig } from '../../types';
import { generateAnimation } from '../generateAnimation';

/**
 * @description
 * `createAnimatedSpan` is a utility function that creates a `<span>` element with animation styles.
 *
 * @param {string} text - The text content of the `<span>`.
 * @param {number} sequenceIndex - The index of the element in the animation sequence.
 * @param {MotionConfig} motion - The motion configuration to generate animation styles from.
 *
 * @returns {ReactElement} A React element `<span>` with inline animation styles.
 */
export const createAnimatedSpan = (text: string, sequenceIndex: number, motion: MotionConfig): ReactElement => {
  const { style } = generateAnimation(motion, sequenceIndex);

  return (
    <span key={sequenceIndex} style={style} aria-hidden="true">
      {text}
    </span>
  );
};

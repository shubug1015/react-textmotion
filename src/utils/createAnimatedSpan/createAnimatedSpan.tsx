import { ReactElement } from 'react';

import { MotionConfig } from '../../types';
import { generateAnimation } from '../generateAnimation';

export const createAnimatedSpan = (text: string, sequenceIndex: number, motion: MotionConfig): ReactElement => {
  const { style } = generateAnimation(motion, sequenceIndex);

  return (
    <span key={sequenceIndex} style={style} aria-hidden="true">
      {text}
    </span>
  );
};

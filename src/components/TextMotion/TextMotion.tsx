import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { ElementType, FC } from 'react';

import { useMergeMotion, useSplitText } from '../../hooks';
import { AnimationPreset, MotionConfig, SplitType } from '../../types';
import { generateAnimation } from '../../utils';

type BaseTextMotionProps = {
  as?: ElementType;
  text: string;
  split?: SplitType;
};

type MotionProps =
  | { motion: MotionConfig; preset?: never }
  | { motion?: never; preset: AnimationPreset[] }
  | { motion?: undefined; preset?: undefined };

type TextMotionProps = BaseTextMotionProps & MotionProps;

export const TextMotion: FC<TextMotionProps> = ({ as: Tag = 'span', text, split = 'character', motion, preset }) => {
  const splittedTexts = useSplitText(text, split);
  const mergedMotion = useMergeMotion(motion, preset);

  return (
    <Tag className="motion" aria-label={text}>
      {splittedTexts.map((splittedText, index) => {
        const animation = generateAnimation(mergedMotion, index);

        if (splittedText === '\n') {
          return <br key={index} />;
        }
        return (
          <span key={index} style={{ animation }} aria-hidden="true">
            {splittedText}
          </span>
        );
      })}
    </Tag>
  );
};

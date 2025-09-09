import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { ElementType, FC } from 'react';

import { useResolvedMotion } from '../../hooks';
import { AnimationPreset, MotionConfig, SplitType } from '../../types';
import { generateAnimation, splitText } from '../../utils';

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
  const splittedTexts = splitText(text, split);
  const resolvedMotion = useResolvedMotion(motion, preset);

  return (
    <Tag className="motion" aria-label={text}>
      {splittedTexts.map((splittedText, index) => {
        const { style } = generateAnimation(resolvedMotion, index);

        if (splittedText === '\n') {
          return <br key={index} />;
        }
        return (
          <span key={index} style={style} aria-hidden="true">
            {splittedText}
          </span>
        );
      })}
    </Tag>
  );
};

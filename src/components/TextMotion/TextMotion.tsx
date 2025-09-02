import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { ElementType, FC, useMemo } from 'react';

import { MotionConfig, PresetConfig, SplitType } from '../../types';
import { generateAnimation, mergeMotion, splitText } from '../../utils';

type BaseTextMotionProps = {
  as?: ElementType;
  text: string;
  split?: SplitType;
};

type MotionProps =
  | { motion: MotionConfig; preset?: never }
  | { motion?: never; preset: PresetConfig }
  | { motion?: undefined; preset?: undefined };

type TextMotionProps = BaseTextMotionProps & MotionProps;

export const TextMotion: FC<TextMotionProps> = ({ as: Tag = 'span', text, split = 'character', motion }) => {
  const textSegments = useMemo(() => splitText(text, split), [text, split]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  return (
    <Tag className="motion" aria-label={text}>
      {textSegments.map((segment, index) => {
        const animation = generateAnimation(mergedMotion, index);

        if (segment === '\n') {
          return <br key={index} />;
        }
        return (
          <span key={index} style={{ animation }} aria-hidden="true">
            {segment}
          </span>
        );
      })}
    </Tag>
  );
};

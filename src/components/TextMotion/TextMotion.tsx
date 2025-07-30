import './TextMotion.scss';
import '../../styles/animations.scss';

import React, { useMemo } from 'react';

import { splitText } from '../../utils';

export type SplitType = 'character' | 'word';
type PresetType = 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown';

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
  split?: SplitType;
  presets?: PresetType[];
};

const DEFAULT_DURATION = 0.25;
const DEFAULT_DELAY = 0.025;

const generateAnimationByPresets = (presets: PresetType[], index: number): React.CSSProperties => {
  const formattedDelay = parseFloat((index * DEFAULT_DELAY).toFixed(3));
  const animation = presets.map(preset => `${preset} ${DEFAULT_DURATION}s ease-out ${formattedDelay}s both`).join(', ');

  return { animation };
};

export const TextMotion = ({ as = 'span', text, split = 'character', presets = ['fadeIn'] }: TextMotionProps) => {
  const Tag = as;
  const letters = useMemo(() => splitText(text, split), [text, split]);

  return (
    <Tag className="text-motion" aria-label={text}>
      {letters.map((letter, index) => (
        <span key={`${letter}-${index}`} style={generateAnimationByPresets(presets, index)} aria-hidden="true">
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </Tag>
  );
};

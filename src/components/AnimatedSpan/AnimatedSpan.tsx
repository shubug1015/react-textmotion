import { FC } from 'react';

import { StyleWithCustomProperties } from '../../utils/generateAnimation/generateAnimation';

type AnimatedSpanProps = {
  text: string;
  style: StyleWithCustomProperties;
};

/**
 * @description
 * `AnimatedSpan` is a component that creates a `<span>` element with animation styles.
 *
 * @param {string} text - The text content to animate.
 * @param {StyleWithCustomProperties} style - The inline styles to apply to the `<span>` element.
 *
 * @returns {JSX.Element} A React element `<span>` with inline animation styles.
 */
export const AnimatedSpan: FC<AnimatedSpanProps> = ({ text, style }) => {
  if (text === '\n') {
    return <br />;
  }

  return (
    <span style={style} aria-hidden="true">
      {text}
    </span>
  );
};

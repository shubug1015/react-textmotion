import { type CSSProperties, type FC } from 'react';

import { useAnimationEndCallback } from '../useAnimationEndCallback';

type Props = {
  text: string;
  style: CSSProperties;
  onAnimationEnd?: () => void;
};

/**
 * @description
 * `AnimatedSpan` is a component that animates a text node by creating a `<span>` element with animation styles.
 *
 * @param {string} text - The text content to animate.
 * @param {CSSProperties} style - The inline styles to apply to the `<span>` element.
 * @param {() => void} [onAnimationEnd] - Callback function that is called when the animation ends.
 *
 * @returns {JSX.Element} A React element `<span>` with inline animation styles.
 */
export const AnimatedSpan: FC<Props> = ({ text, style, onAnimationEnd }) => {
  const handleAnimationEnd = useAnimationEndCallback(onAnimationEnd);

  // if (text === '\n') {
  //   return <br />;
  // }

  return (
    <span style={style} aria-hidden="true" onAnimationEnd={handleAnimationEnd}>
      {text}
    </span>
  );
};

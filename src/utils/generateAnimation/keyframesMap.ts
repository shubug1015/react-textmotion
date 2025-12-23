import * as animations from '../../styles/animations.css.ts';
import type { AnimationName } from '../../types';

export const keyframesMap: Record<AnimationName, Record<string, string>> = {
  fade: {
    in: animations.fadeIn,
    out: animations.fadeOut,
  },
  slide: {
    up: animations.slideUp,
    down: animations.slideDown,
    left: animations.slideLeft,
    right: animations.slideRight,
  },
  scale: {
    in: animations.scaleIn,
    out: animations.scaleOut,
  },
  rotate: {
    clockwise: animations.rotateClockwise,
    counterclockwise: animations.rotateCounterclockwise,
  },
  bounce: {
    in: animations.bounceIn,
    out: animations.bounceOut,
  },
  elastic: {
    in: animations.elasticIn,
    out: animations.elasticOut,
  },
  flip: {
    in: animations.flipIn,
    out: animations.flipOut,
  },
};

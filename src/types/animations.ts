/**
 * @description
 * Base properties for all animations.
 *
 * @property {number} duration - The duration of the animation in seconds.
 * @property {number} delay - The delay before the animation starts, in seconds.
 * @property {'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end'} [easing] - The easing function for the animation.
 */
export type BaseAnimation = {
  duration: number;
  delay: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end';
};

/**
 * @description
 * Properties for fade animations.
 *
 * @property {'in' | 'out'} variant - The variant of the fade animation.
 * @property {number} [from] - The starting opacity.
 * @property {number} [to] - The ending opacity.
 */
export type FadeAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: number;
  to?: number;
};

/**
 * @description
 * Properties for slide animations.
 *
 * @property {'up' | 'down' | 'left' | 'right'} variant - The direction of the slide animation.
 * @property {string} [distance] - The distance to slide.
 */
export type SlideAnimation = BaseAnimation & {
  variant: 'up' | 'down' | 'left' | 'right';
  distance?: string;
};

/**
 * @description
 * Properties for scale animations.
 *
 * @property {'in' | 'out'} variant - The variant of the scale animation.
 * @property {number} [from] - The starting scale.
 * @property {number} [to] - The ending scale.
 */
export type ScaleAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: number;
  to?: number;
};

/**
 * @description
 * Properties for rotate animations.
 *
 * @property {'clockwise' | 'counterclockwise'} variant - The direction of the rotation.
 * @property {string} [from] - The starting rotation angle.
 * @property {string} [to] - The ending rotation angle.
 */
export type RotateAnimation = BaseAnimation & {
  variant: 'clockwise' | 'counterclockwise';
  from?: string;
  to?: string;
  // axis?: 'x' | 'y' | 'z';
};

/**
 * @description
 * Properties for bounce animations.
 *
 * @property {'in' | 'out'} variant - The variant of the bounce animation.
 * @property {number} [from] - The starting position.
 * @property {number} [mid] - The mid position of the bounce.
 * @property {number} [to] - The ending position.
 */
export type BounceAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: number;
  mid?: number;
  to?: number;
};

/**
 * @description
 * Properties for elastic animations.
 *
 * @property {'in' | 'out'} variant - The variant of the elastic animation.
 * @property {number} [from] - The starting position.
 * @property {number} [mid1] - The first mid position of the elastic effect.
 * @property {number} [mid2] - The second mid position of the elastic effect.
 * @property {number} [to] - The ending position.
 */
export type ElasticAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: number;
  mid1?: number;
  mid2?: number;
  to?: number;
};

/**
 * @description
 * Properties for flip animations.
 *
 * @property {'in' | 'out'} variant - The variant of the flip animation.
 * @property {string} [from] - The starting rotation angle for the flip.
 * @property {string} [to] - The ending rotation angle for the flip.
 */
export type FlipAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: string;
  to?: string;
  // axis?: 'x' | 'y';
};

/**
 * @description
 * Properties for user-defined custom animations.
 *
 * @property {string} name - The name of the custom CSS animation (keyframes).
 * @property {number} duration - The duration of the animation in seconds.
 * @property {number} delay - The delay for each step in the sequence, in seconds.
 * @property {'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end'} [easing] - The easing function for the animation.
 */
export type CustomAnimation = BaseAnimation & {
  name: string;
};

import type {
  BounceAnimation,
  CustomAnimation,
  ElasticAnimation,
  FadeAnimation,
  FlipAnimation,
  RotateAnimation,
  ScaleAnimation,
  SlideAnimation,
} from './animations';

/**
 * @description
 * Defines how text is split for animation.
 * - `character`: Splits the text into individual characters.
 * - `word`: Splits the text into words.
 * - `line`: Splits the text into lines.
 */
export type Split = 'character' | 'word' | 'line';

/**
 * @description
 * Defines when the animation should start.
 * - `on-load`: Starts the animation immediately.
 * - `scroll`: Starts the animation only when the component enters the viewport.
 */
export type Trigger = 'on-load' | 'scroll';

/**
 * @description
 * Defines the order of animation.
 * - `first-to-last`: Animates from the first element to the last element.
 * - `last-to-first`: Animates from the last element to the first element.
 */
export type AnimationOrder = 'first-to-last' | 'last-to-first';

/**
 * @description
 * A configuration object that defines the animations to be applied.
 * Each property corresponds to a type of animation and holds its specific configuration.
 *
 * @property {FadeAnimation} [fade] - Configuration for fade animation.
 * @property {SlideAnimation} [slide] - Configuration for slide animation.
 * @property {ScaleAnimation} [scale] - Configuration for scale animation.
 * @property {RotateAnimation} [rotate] - Configuration for rotate animation.
 * @property {BounceAnimation} [bounce] - Configuration for bounce animation.
 * @property {ElasticAnimation} [elastic] - Configuration for elastic animation.
 * @property {FlipAnimation} [flip] - Configuration for flip animation.
 * @property {CustomAnimation} [key] - Configuration for any custom animation.
 */
export type Motion = {
  fade?: FadeAnimation;
  slide?: SlideAnimation;
  scale?: ScaleAnimation;
  rotate?: RotateAnimation;
  bounce?: BounceAnimation;
  elastic?: ElasticAnimation;
  flip?: FlipAnimation;
  [key: string]: CustomAnimation | undefined;
};

/**
 * @description
 * A list of predefined animation presets that can be used with the `TextMotion` and `NodeMotion` components.
 * Each preset corresponds to a specific animation configuration.
 */
export type Preset =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'scale-out'
  | 'rotate-clockwise'
  | 'rotate-counterclockwise'
  | 'bounce-in'
  | 'bounce-out'
  | 'elastic-in'
  | 'elastic-out'
  | 'flip-in'
  | 'flip-out';

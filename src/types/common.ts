import {
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
export type SplitType = 'character' | 'word' | 'line';

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
export type MotionConfig = {
  fade?: FadeAnimation;
  slide?: SlideAnimation;
  scale?: ScaleAnimation;
  rotate?: RotateAnimation;
  bounce?: BounceAnimation;
  elastic?: ElasticAnimation;
  flip?: FlipAnimation;
  [key: string]: CustomAnimation | undefined;
};

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};

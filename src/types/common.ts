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

export type SplitType = 'character' | 'word' | 'line';

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

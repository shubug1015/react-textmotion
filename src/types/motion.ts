export type SplitType = 'character' | 'word';

export type VariantType = 'fade' | 'slide';

export type FadeVariant = 'in' | 'out';
export type SlideVariant = 'up' | 'down' | 'right' | 'left';

export type Motion<V extends string> = {
  variant: V;
  duration: number;
  delay: number;
};

export type MotionConfig = {
  fade?: Motion<FadeVariant>;
  slide?: Motion<SlideVariant>;
};

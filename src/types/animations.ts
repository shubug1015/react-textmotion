export type BaseAnimation = {
  duration: number;
  delay: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end';
};

export type FadeAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: number;
  to?: number;
};

export type SlideAnimation = BaseAnimation & {
  variant: 'up' | 'down' | 'left' | 'right';
  distance?: string;
};

export type ScaleAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: number;
  to?: number;
};

export type RotateAnimation = BaseAnimation & {
  variant: 'clockwise' | 'counterclockwise';
  from?: string;
  to?: string;
  // axis?: 'x' | 'y' | 'z';
};

export type BounceAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: number;
  mid?: number;
  to?: number;
};

export type ElasticAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: number;
  mid1?: number;
  mid2?: number;
  to?: number;
};

export type FlipAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  from?: string;
  to?: string;
  // axis?: 'x' | 'y';
};

export type CustomAnimation = BaseAnimation & {
  [key: string]: unknown;
};

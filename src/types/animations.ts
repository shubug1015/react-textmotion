export type BaseAnimation = {
  duration: number;
  delay: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
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
  from?: number;
  to?: number;
  axis?: 'x' | 'y' | 'z';
};

export type BounceAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  intensity?: 'low' | 'medium' | 'high';
};

export type ElasticAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  tension?: number;
  friction?: number;
};

export type FlipAnimation = BaseAnimation & {
  variant: 'in' | 'out';
  perspective?: string;
  axis?: 'x' | 'y';
};

export type CustomAnimation = BaseAnimation & {
  [key: string]: unknown;
};

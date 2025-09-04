export type AnimationPreset =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'scale-out'
  | 'rotate-in'
  | 'rotate-out'
  | 'bounce-in'
  | 'bounce-out'
  | 'elastic-in'
  | 'elastic-out'
  | 'flip-in'
  | 'flip-out';

export type PresetConfig = AnimationPreset[];

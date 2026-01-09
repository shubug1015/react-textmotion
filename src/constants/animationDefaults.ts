/**
 * @description
 * Default values for animation configurations.
 */

/**
 * Default easing function for animations.
 */
export const DEFAULT_EASING = 'ease-out';

/**
 * Key name for custom animation configuration.
 */
export const CUSTOM_ANIMATION_KEY = 'custom';

/**
 * Animation defaults configuration object.
 */
export const ANIMATION_DEFAULTS = {
  EASING: DEFAULT_EASING,
  CUSTOM_ANIMATION_KEY,
} as const;

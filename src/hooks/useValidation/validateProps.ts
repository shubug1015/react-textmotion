import type { CustomAnimation, Motion, TextMotionProps } from '../../types';

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};

const ALLOWED_SPLITS = ['character', 'word'] as const;
const ALLOWED_TRIGGERS = ['on-load', 'scroll'] as const;
const ALLOWED_ANIMATION_ORDERS = ['first-to-last', 'last-to-first'] as const;

const MAX_RECOMMENDED_DURATION = 10;

/**
 * @description
 * Validates props for the TextMotion component.
 * This utility is intentionally scoped to TextMotion only.
 */
export const validateProps = (props: TextMotionProps): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (props.children === undefined || props.children === null) {
    warnings.push('children prop is empty.');
  }

  if (props.split && !ALLOWED_SPLITS.includes(props.split)) {
    errors.push(`split must be one of: ${ALLOWED_SPLITS.join(', ')}`);
  }

  if (props.trigger && !ALLOWED_TRIGGERS.includes(props.trigger)) {
    errors.push(`trigger must be one of: ${ALLOWED_TRIGGERS.join(', ')}`);
  }

  if (props.repeat !== undefined && typeof props.repeat !== 'boolean') {
    errors.push('repeat must be a boolean.');
  }

  if (props.initialDelay !== undefined && props.initialDelay < 0) {
    errors.push('initialDelay must be greater than or equal to 0.');
  }

  if (props.animationOrder && !ALLOWED_ANIMATION_ORDERS.includes(props.animationOrder)) {
    errors.push(`animationOrder must be one of: ${ALLOWED_ANIMATION_ORDERS.join(', ')}`);
  }

  if (props.motion) {
    const motionResult = validateMotionProps(props.motion);
    errors.push(...motionResult.errors);
    warnings.push(...motionResult.warnings);
  }

  if (props.preset && !Array.isArray(props.preset)) {
    errors.push('preset must be an array.');
  }

  if (props.onAnimationStart && typeof props.onAnimationStart !== 'function') {
    errors.push('onAnimationStart must be a function.');
  }

  if (props.onAnimationEnd && typeof props.onAnimationEnd !== 'function') {
    errors.push('onAnimationEnd must be a function.');
  }

  return { errors, warnings };
};

const validateMotionProps = (motion: Motion): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.entries(motion).forEach(([key, config]) => {
    if (config === undefined || config === null) return;

    if (config.duration <= 0) {
      errors.push(`${key}.duration must be greater than 0.`);
    }

    if (config.delay < 0) {
      errors.push(`${key}.delay must be greater than or equal to 0.`);
    }

    if (config.duration > MAX_RECOMMENDED_DURATION) {
      warnings.push(`${key}.duration is very long (${config.duration}s).`);
    }

    if (key === 'custom') {
      const custom = config as CustomAnimation;

      if (!custom.name || typeof custom.name !== 'string') {
        errors.push('custom.name must be a non-empty string.');
      }
    }
  });

  return { errors, warnings };
};

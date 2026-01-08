import type { CustomAnimation, Motion, TextMotionProps } from '../../types';

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};

/**
 * @description
 * Validates the props for the TextMotion component.
 * It warns if the 'children' prop is empty, checks the value of the 'split' prop,
 * and runs validation on the 'motion' prop.
 *
 * @param {TextMotionProps} props - The props of the TextMotion component to validate.
 * @returns {ValidationResult} An object containing arrays of errors and warnings.
 */
export const validateTextMotionProps = (props: TextMotionProps): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (props.children === undefined || props.children === null) {
    warnings.push('children prop is empty');
  }

  if (props.split === 'line' && typeof props.children !== 'string') {
    warnings.push('split="line" is only applicable when children is a string.');
  }

  const common = validateCommonProps(props);

  errors.push(...common.errors);
  warnings.push(...common.warnings);

  return { errors, warnings };
};

/**
 * @description
 * Validates common props for the TextMotion component.
 *
 * @param {Partial<TextMotionProps>} props - The props to validate.
 * @returns {ValidationResult} An object containing arrays of errors and warnings.
 */
const validateCommonProps = (props: Partial<TextMotionProps>): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (props.split !== undefined && !['character', 'word', 'line'].includes(props.split)) {
    errors.push('split prop must be one of: character, word, line');
  }

  if (props.trigger !== undefined && !['on-load', 'scroll'].includes(props.trigger)) {
    errors.push('trigger prop must be one of: on-load, scroll');
  }

  if (props.repeat !== undefined && typeof props.repeat !== 'boolean') {
    errors.push('repeat prop must be a boolean');
  }

  if (props.initialDelay !== undefined && props.initialDelay < 0) {
    errors.push('initialDelay prop must be non-negative');
  }

  if (props.animationOrder !== undefined && !['first-to-last', 'last-to-first'].includes(props.animationOrder)) {
    errors.push('animationOrder prop must be one of: first-to-last, last-to-first');
  }

  if (props.motion !== undefined) {
    const motionValidation = validateMotion(props.motion);

    errors.push(...motionValidation.errors);
    warnings.push(...motionValidation.warnings);
  }

  if (props.preset !== undefined && !Array.isArray(props.preset)) {
    errors.push('preset prop must be an array');
  }

  if (props.onAnimationStart !== undefined && typeof props.onAnimationStart !== 'function') {
    errors.push('onAnimationStart prop must be a function');
  }

  if (props.onAnimationEnd !== undefined && typeof props.onAnimationEnd !== 'function') {
    errors.push('onAnimationEnd prop must be a function');
  }

  return { errors, warnings };
};

/**
 * @description
 * Validates the motion configuration object.
 * It checks for positive duration, non-negative delay, and warns if the duration is too long.
 *
 * @param {Motion} motion - The motion configuration to validate.
 * @returns {ValidationResult} An object containing arrays of errors and warnings.
 */
const validateMotion = (motion: Motion): ValidationResult => {
  const MAX_RECOMMENDED_DURATION = 10;

  const errors: string[] = [];
  const warnings: string[] = [];

  Object.entries(motion).forEach(([key, config]) => {
    if (config === undefined || config === null) return;

    if (config.duration <= 0) {
      errors.push(`${key}.duration must be greater than 0`);
    }

    if (config.delay < 0) {
      errors.push(`${key}.delay must be non-negative`);
    }

    if (config.duration > MAX_RECOMMENDED_DURATION) {
      warnings.push(`${key}.duration is very long (${config.duration}s)`);
    }

    if (key === 'custom') {
      const customConfig = config as CustomAnimation;

      if (typeof customConfig.name !== 'string' || customConfig.name.trim() === '') {
        errors.push('custom.name must be a non-empty string');
      }
    }
  });

  return { errors, warnings };
};

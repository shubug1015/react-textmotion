import { MotionConfig, NodeMotionProps, TextMotionProps, ValidationResult } from '../../types';

const validateMotionConfig = (motion: MotionConfig): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.entries(motion).forEach(([key, config]) => {
    if (!config) return;

    if (config.duration <= 0) {
      errors.push(`${key}.duration must be greater than 0`);
    }

    if (config.delay < 0) {
      errors.push(`${key}.delay must be non-negative`);
    }

    if (config.duration > 10) {
      warnings.push(`${key}.duration is very long (${config.duration}s)`);
    }
  });

  return { errors, warnings };
};

export const validateTextMotionProps = (props: TextMotionProps): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (props.text === undefined || props.text === null) {
    errors.push('text prop is required');
  } else if (typeof props.text !== 'string') {
    errors.push('text prop must be a string');
  } else if (props.text.trim() === '') {
    warnings.push('text prop is empty or contains only whitespace');
  }

  if (props.split !== undefined && !['character', 'word', 'line'].includes(props.split)) {
    errors.push('split prop must be one of: character, word, line');
  }

  if (props.motion !== undefined) {
    const motionValidation = validateMotionConfig(props.motion);

    errors.push(...motionValidation.errors);
    warnings.push(...motionValidation.warnings);
  }

  return { errors, warnings };
};

export const validateNodeMotionProps = (props: NodeMotionProps): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (props.children === undefined || props.children === null) {
    warnings.push('children prop is empty');
  }

  if (props.split !== undefined && !['character', 'word'].includes(props.split)) {
    errors.push('split prop must be one of: character, word');
  }

  if (props.motion !== undefined) {
    const motionValidation = validateMotionConfig(props.motion);

    errors.push(...motionValidation.errors);
    warnings.push(...motionValidation.warnings);
  }

  return { errors, warnings };
};

import { Motion, NodeMotionProps, TextMotionProps } from '../../types';

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};

/**
 * @description
 * Validates the props for the TextMotion component.
 * It checks for the presence and type of the 'text' prop, the value of the 'split' prop,
 * and runs validation on the 'motion' prop.
 *
 * @param {TextMotionProps} props - The props of the TextMotion component to validate.
 * @returns {ValidationResult} An object containing arrays of errors and warnings.
 */
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

  const common = validateCommonProps(props);

  errors.push(...common.errors);
  warnings.push(...common.warnings);

  return { errors, warnings };
};

/**
 * @description
 * Validates the props for the NodeMotion component.
 * It warns if the 'children' prop is empty, checks the value of the 'split' prop,
 * and runs validation on the 'motion' prop.
 *
 * @param {NodeMotionProps} props - The props of the NodeMotion component to validate.
 * @returns {ValidationResult} An object containing arrays of errors and warnings.
 */
export const validateNodeMotionProps = (props: NodeMotionProps): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (props.children === undefined || props.children === null) {
    warnings.push('children prop is empty');
  }

  const common = validateCommonProps(props);

  errors.push(...common.errors);
  warnings.push(...common.warnings);

  return { errors, warnings };
};

/**
 * @description
 * Validates common props for both TextMotion and NodeMotion components.
 *
 * @param {Partial<TextMotionProps | NodeMotionProps>} props - The props to validate.
 * @returns {ValidationResult} An object containing arrays of errors and warnings.
 */
const validateCommonProps = (props: Partial<TextMotionProps | NodeMotionProps>): ValidationResult => {
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
    if (!config) return;

    if (config.duration <= 0) {
      errors.push(`${key}.duration must be greater than 0`);
    }

    if (config.delay < 0) {
      errors.push(`${key}.delay must be non-negative`);
    }

    if (config.duration > MAX_RECOMMENDED_DURATION) {
      warnings.push(`${key}.duration is very long (${config.duration}s)`);
    }
  });

  return { errors, warnings };
};

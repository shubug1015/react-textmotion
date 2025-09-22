import { useEffect } from 'react';

import type { NodeMotionProps, TextMotionProps } from '../../types';

import { validateNodeMotionProps, validateTextMotionProps } from './validation';

/**
 * @description
 * Validates the props of a TextMotion or NodeMotion component.
 * It checks for required props, invalid values, and logs warnings or throws errors in non-production environments.
 *
 * @param {'TextMotion' | 'NodeMotion'} componentName - The name of the component to validate ('TextMotion' or 'NodeMotion').
 * @param {TextMotionProps | NodeMotionProps} props - The props to validate.
 */
export const useValidation = (componentName: 'TextMotion' | 'NodeMotion', props: TextMotionProps | NodeMotionProps) => {
  useEffect(() => {
    const { errors, warnings } =
      componentName === 'TextMotion'
        ? validateTextMotionProps(props as TextMotionProps)
        : validateNodeMotionProps(props as NodeMotionProps);

    if (errors.length > 0 || warnings.length > 0) {
      handleValidation(errors, warnings);
    }
  }, [props, componentName]);
};

/**
 * @description
 * Handles validation errors and warnings by logging them to the console.
 * In a non-production environment, it will throw an error if there are any validation errors.
 *
 * @param {string[]} errors - A list of validation error messages.
 * @param {string[]} warnings - A list of validation warning messages.
 */
export const handleValidation = (errors: string[], warnings: string[]) => {
  if (process.env.NODE_ENV !== 'production') {
    if (errors.length > 0) {
      console.error('TextMotion validation errors:', errors);

      throw new Error(`TextMotion: ${errors.join(', ')}`);
    }

    if (warnings.length > 0) {
      console.warn('TextMotion validation warnings:', warnings);
    }
  }
};

import { useEffect } from 'react';

import type { TextMotionProps } from '../../types';

import { validateTextMotionProps } from './validation';

type UseValidationProps = {
  componentName: 'TextMotion';
  props: TextMotionProps;
};

/**
 * @description
 * Validates the props of the TextMotion component.
 * It checks for required props, invalid values, and logs warnings or throws errors in non-production environments.
 *
 * @param {'TextMotion'} componentName - The name of the component to validate.
 * @param {TextMotionProps} props - The props to validate.
 */
export const useValidation = ({ componentName, props }: UseValidationProps) => {
  useEffect(() => {
    const { errors, warnings } = validateTextMotionProps(props);

    if (errors.length > 0 || warnings.length > 0) {
      handleValidation(componentName, errors, warnings);
    }
  }, [componentName, props]);
};

/**
 * @description
 * Handles validation errors and warnings by logging them to the console.
 * In a non-production environment, it will throw an error if there are any validation errors.
 *
 * @param {string} componentName - The name of the component being validated.
 * @param {string[]} errors - A list of validation error messages.
 * @param {string[]} warnings - A list of validation warning messages.
 */
export const handleValidation = (componentName: string, errors: string[], warnings: string[]) => {
  if (process.env.NODE_ENV !== 'production') {
    if (errors.length > 0) {
      console.error(`${componentName} validation errors:`, errors);

      throw new Error(`${componentName}: ${errors.join(', ')}`);
    }

    if (warnings.length > 0) {
      console.warn(`${componentName} validation warnings:`, warnings);
    }
  }
};

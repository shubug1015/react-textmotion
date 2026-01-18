import { useEffect } from 'react';

import type { TextMotionProps } from '../../types';

import { validateProps } from './validateProps';

/**
 * @description
 * Validates the props of the TextMotion component.
 * It checks for required props, invalid values, and logs warnings or throws errors in non-production environments.
 *
 * @param {TextMotionProps} props - The props to validate.
 */
export const useValidation = (props: TextMotionProps) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;

    const { errors, warnings } = validateProps(props);

    if (errors.length > 0) {
      console.error('TextMotion validation errors:', errors);
      throw new Error(`TextMotion: ${errors.join(' ')}`);
    }

    if (warnings.length > 0) {
      console.warn('TextMotion validation warnings:', warnings);
    }
  }, [props]);
};

export const handleValidation = (errors: string[], warnings: string[]) => {
  if (__DEV__) {
    if (errors.length > 0) {
      console.error('TextMotion validation errors:', errors);

      throw new Error(`TextMotion: ${errors.join(', ')}`);
    }

    if (warnings.length > 0) {
      console.warn('TextMotion validation warnings:', warnings);
    }
  }
};

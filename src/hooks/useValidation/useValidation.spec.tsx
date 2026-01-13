import { render } from '@testing-library/react';

import type { TextMotionProps } from '../../types';

import { handleValidation, useValidation } from './useValidation';

describe('useValidation hook', () => {
  const TestComponent = ({ props }: { props: any }) => {
    useValidation({ componentName: 'TextMotion', props });

    return <div>Test</div>;
  };

  it('should throw an error for invalid TextMotionProps', () => {
    const props: Partial<TextMotionProps> = {
      split: 'invalid-split' as any,
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent props={props} />)).toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'TextMotion validation errors:',
      expect.arrayContaining(['split prop must be one of: character, word'])
    );

    consoleErrorSpy.mockRestore();
  });

  it('should not throw for valid TextMotionProps', () => {
    const props: TextMotionProps = {
      children: <span>Hello</span>,
      split: 'word',
      trigger: 'on-load',
      repeat: true,
      initialDelay: 0,
      animationOrder: 'first-to-last',
      motion: undefined,
    };

    expect(() => render(<TestComponent props={props} />)).not.toThrow();
  });
});

describe('handleValidation', () => {
  const ORIGINAL_ENV = process.env.NODE_ENV;

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NODE_ENV = ORIGINAL_ENV;
  });

  it('should throw an error when errors are present in non-production', () => {
    process.env.NODE_ENV = 'development';

    const errors: string[] = ['some validation error'];
    const warnings: string[] = [];

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => handleValidation('TextMotion', errors, warnings)).toThrow('TextMotion: some validation error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('TextMotion validation errors:', errors);
  });

  it('should log warnings when only warnings are present in non-production', () => {
    process.env.NODE_ENV = 'development';

    const errors: string[] = [];
    const warnings: string[] = ['some validation warning'];

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    handleValidation('TextMotion', errors, warnings);

    expect(consoleWarnSpy).toHaveBeenCalledWith('TextMotion validation warnings:', warnings);
  });

  it('should not log anything when no errors or warnings in non-production', () => {
    process.env.NODE_ENV = 'development';

    const errors: string[] = [];
    const warnings: string[] = [];

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    handleValidation('TextMotion', errors, warnings);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should not throw or log in production', () => {
    process.env.NODE_ENV = 'production';

    const errors: string[] = ['some validation error'];
    const warnings: string[] = ['some validation warning'];

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => handleValidation('TextMotion', errors, warnings)).not.toThrow();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});

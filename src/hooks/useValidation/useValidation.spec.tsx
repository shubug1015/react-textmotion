import { render } from '@testing-library/react';

import { NodeMotionProps, TextMotionProps } from '../../types';

import { handleValidation, useValidation } from './useValidation';

describe('useValidation hook', () => {
  const TestComponent = ({ componentName, props }: { componentName: 'TextMotion' | 'NodeMotion'; props: any }) => {
    useValidation(componentName, props);

    return <div>Test</div>;
  };

  it('should call handleValidation with errors for invalid TextMotionProps', () => {
    const props: TextMotionProps = {
      text: null as any,
      split: 'invalid' as any,
      trigger: 'invalid' as any,
      repeat: 'yes' as any,
      initialDelay: -1,
      animationOrder: 'reverse' as any,
      motion: undefined,
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    jest.spyOn(console, 'log').mockImplementation(() => {});

    expect(() => render(<TestComponent componentName="TextMotion" props={props} />)).toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'TextMotion validation errors:',
      expect.arrayContaining(['text prop is required'])
    );
  });

  it('should not throw for valid NodeMotionProps', () => {
    const props: NodeMotionProps = {
      children: <span>Hello</span>,
      split: 'word',
      trigger: 'on-load',
      repeat: true,
      initialDelay: 0,
      animationOrder: 'first-to-last',
      motion: undefined,
    };

    expect(() => render(<TestComponent componentName="NodeMotion" props={props} />)).not.toThrow();
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

    const errors: string[] = ['text prop is required'];
    const warnings: string[] = [];

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => handleValidation(errors, warnings)).toThrow('TextMotion: text prop is required');
    expect(consoleErrorSpy).toHaveBeenCalledWith('TextMotion validation errors:', errors);
  });

  it('should log warnings when only warnings are present in non-production', () => {
    process.env.NODE_ENV = 'development';

    const errors: string[] = [];
    const warnings: string[] = ['text prop is empty'];

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    handleValidation(errors, warnings);

    expect(consoleWarnSpy).toHaveBeenCalledWith('TextMotion validation warnings:', warnings);
  });

  it('should not log anything when no errors or warnings in non-production', () => {
    process.env.NODE_ENV = 'development';

    const errors: string[] = [];
    const warnings: string[] = [];

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    handleValidation(errors, warnings);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should not throw or log in production', () => {
    process.env.NODE_ENV = 'production';

    const errors: string[] = ['text prop is required'];
    const warnings: string[] = ['text prop is empty'];

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => handleValidation(errors, warnings)).not.toThrow();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});

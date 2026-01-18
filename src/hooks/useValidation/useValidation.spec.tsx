import { render } from '@testing-library/react';

import type { TextMotionProps } from '../../types';

import { useValidation } from './useValidation';

describe('useValidation (TextMotion)', () => {
  const ORIGINAL_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    process.env.NODE_ENV = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  const TestComponent = ({ props }: { props: TextMotionProps }) => {
    useValidation(props);
    return <div>Test</div>;
  };

  it('throws an error and logs when props are invalid (dev)', () => {
    const props = {
      split: 'invalid' as any,
    } as TextMotionProps;

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent props={props} />)).toThrow(/TextMotion:/);

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('does not throw for valid props (dev)', () => {
    const props: TextMotionProps = {
      children: 'Hello',
      split: 'word',
      trigger: 'on-load',
      repeat: true,
      initialDelay: 0,
      animationOrder: 'first-to-last',
    };

    expect(() => render(<TestComponent props={props} />)).not.toThrow();
  });

  it('logs warnings but does not throw when only warnings exist', () => {
    const props = {} as TextMotionProps;

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => render(<TestComponent props={props} />)).not.toThrow();
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('does nothing in production environment', () => {
    process.env.NODE_ENV = 'production';

    const props = {
      split: 'invalid' as any,
    } as TextMotionProps;

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent props={props} />)).not.toThrow();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});

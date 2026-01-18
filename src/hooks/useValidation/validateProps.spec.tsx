import type { TextMotionProps } from '../../types';

import { validateProps } from './validateProps';

describe('validateProps (TextMotion)', () => {
  it('returns no errors or warnings for valid props', () => {
    const props: TextMotionProps = {
      children: 'Hello World',
      split: 'word',
      trigger: 'scroll',
      repeat: false,
      initialDelay: 0,
      animationOrder: 'last-to-first',
      motion: {
        custom: { name: 'custom-animation', duration: 1, delay: 0 },
      },
    };

    const result = validateProps(props);

    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('warns when children is empty', () => {
    const result = validateProps({} as TextMotionProps);

    expect(result.warnings).toContain('children prop is empty.');
  });

  it('accepts all valid split values', () => {
    (['character', 'word'] as const).forEach(split => {
      const result = validateProps({ children: 'text', split });

      expect(result.errors).toHaveLength(0);
    });
  });

  it('handles undefined or null motion configs safely', () => {
    const props: TextMotionProps = {
      children: 'text',
      motion: {
        custom: undefined,
      },
    };

    const result = validateProps(props);

    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('collects motion errors and warnings together', () => {
    const props: TextMotionProps = {
      children: 'text',
      motion: {
        fade: { variant: 'in', duration: 0, delay: -2 },
        slide: { variant: 'up', duration: 20, delay: 0 },
      },
    };

    const { errors, warnings } = validateProps(props);

    expect(errors).toHaveLength(2);
    expect(errors.some(e => e.includes('fade.duration'))).toBe(true);
    expect(errors.some(e => e.includes('fade.delay'))).toBe(true);

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('slide.duration is very long');
  });

  it('errors on invalid trigger', () => {
    const props = { children: 'test', trigger: 'invalid' as any };

    const { errors } = validateProps(props as TextMotionProps);

    expect(errors.some(e => e.includes('trigger must be one of'))).toBe(true);
  });

  it('errors on invalid repeat type', () => {
    const props = { children: 'test', repeat: 'nope' as any };

    const { errors } = validateProps(props as TextMotionProps);

    expect(errors).toContain('repeat must be a boolean.');
  });

  it('errors on negative initialDelay', () => {
    const props = { children: 'test', initialDelay: -1 };

    const { errors } = validateProps(props as TextMotionProps);

    expect(errors).toContain('initialDelay must be greater than or equal to 0.');
  });

  it('errors on invalid animationOrder', () => {
    const props = { children: 'test', animationOrder: 'invalid' as any };

    const { errors } = validateProps(props as TextMotionProps);

    expect(errors.some(e => e.includes('animationOrder must be one of'))).toBe(true);
  });

  it('errors when preset is not an array', () => {
    const props = { children: 'test', preset: 'invalid' as any };

    const { errors } = validateProps(props as TextMotionProps);

    expect(errors).toContain('preset must be an array.');
  });

  it('errors when onAnimationStart is not a function', () => {
    const props = { children: 'test', onAnimationStart: 'nope' as any };

    const { errors } = validateProps(props as TextMotionProps);

    expect(errors).toContain('onAnimationStart must be a function.');
  });

  it('errors when onAnimationEnd is not a function', () => {
    const props = { children: 'test', onAnimationEnd: 'nope' as any };

    const { errors } = validateProps(props as TextMotionProps);

    expect(errors).toContain('onAnimationEnd must be a function.');
  });

  it('errors when custom.name is empty', () => {
    const props: TextMotionProps = {
      children: 'test',
      motion: {
        custom: { name: '', duration: 1, delay: 0 },
      },
    };

    const { errors } = validateProps(props);

    expect(errors).toContain('custom.name must be a non-empty string.');
  });
});

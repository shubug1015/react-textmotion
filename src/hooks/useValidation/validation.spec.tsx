import type { TextMotionProps } from '../../types';

import { validateTextMotionProps } from './validation';

describe('validation utility', () => {
  describe('validateTextMotionProps', () => {
    it('should return no errors or warnings for valid props', () => {
      const props: TextMotionProps = {
        children: 'Hello World',
        split: 'word',
        trigger: 'scroll',
        repeat: false,
        initialDelay: 0,
        animationOrder: 'last-to-first',
        motion: { custom: { name: 'custom-animation', duration: 1, delay: 0 } },
      };
      const { errors, warnings } = validateTextMotionProps(props);

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(0);
    });

    it('should return a warning if children prop is empty', () => {
      const props = {} as TextMotionProps;
      const { warnings } = validateTextMotionProps(props);

      expect(warnings).toContain('children prop is empty');
    });

    it('should return a warning for "line" split with non-string children', () => {
      const props: TextMotionProps = {
        children: [<div key="1" />],
        split: 'line',
      };
      const { warnings } = validateTextMotionProps(props);

      expect(warnings).toContain('split="line" is only applicable when children is a string.');
    });

    it('should accept valid split values', () => {
      (['character', 'word', 'line'] as const).forEach(split => {
        const props: TextMotionProps = { children: 'hello', split };
        const { errors } = validateTextMotionProps(props);

        expect(errors).toHaveLength(0);
      });
    });

    it('should handle null or undefined motion config values', () => {
      const props: TextMotionProps = {
        children: 'hello',
        motion: {
          custom: undefined,
        },
      };
      const { errors, warnings } = validateTextMotionProps(props);

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(0);
    });

    it('should validate motion config errors and warnings together', () => {
      const props: TextMotionProps = {
        children: 'hello',
        motion: {
          fade: { variant: 'in', duration: 0, delay: -2 },
          slide: { variant: 'up', duration: 20, delay: 0 },
        },
      };
      const { errors, warnings } = validateTextMotionProps(props);

      expect(errors).toEqual(['fade.duration must be greater than 0', 'fade.delay must be non-negative']);
      expect(warnings).toEqual(['slide.duration is very long (20s)']);
    });
  });

  describe('validateCommonProps', () => {
    it('should return an error for invalid trigger', () => {
      const props: Partial<TextMotionProps> = { children: 'test', trigger: 'invalid' as any };
      const { errors } = validateTextMotionProps(props as TextMotionProps);

      expect(errors).toContain('trigger prop must be one of: on-load, scroll');
    });

    it('should return an error for invalid repeat type', () => {
      const props: Partial<TextMotionProps> = { children: 'test', repeat: 'not-a-boolean' as any };
      const { errors } = validateTextMotionProps(props as TextMotionProps);

      expect(errors).toContain('repeat prop must be a boolean');
    });

    it('should return an error for negative initialDelay', () => {
      const props: Partial<TextMotionProps> = { children: 'test', initialDelay: -1 };
      const { errors } = validateTextMotionProps(props as TextMotionProps);

      expect(errors).toContain('initialDelay prop must be non-negative');
    });

    it('should return an error for invalid animationOrder', () => {
      const props: Partial<TextMotionProps> = { children: 'test', animationOrder: 'invalid' as any };
      const { errors } = validateTextMotionProps(props as TextMotionProps);

      expect(errors).toContain('animationOrder prop must be one of: first-to-last, last-to-first');
    });

    it('should return an error for invalid preset type', () => {
      const props: Partial<TextMotionProps> = { children: 'test', preset: 'not-an-array' as any };
      const { errors } = validateTextMotionProps(props as TextMotionProps);

      expect(errors).toContain('preset prop must be an array');
    });

    it('should return an error for invalid onAnimationStart type', () => {
      const props: Partial<TextMotionProps> = { children: 'test', onAnimationStart: 'not-a-function' as any };
      const { errors } = validateTextMotionProps(props as TextMotionProps);

      expect(errors).toContain('onAnimationStart prop must be a function');
    });

    it('should return an error for invalid onAnimationEnd type', () => {
      const props: Partial<TextMotionProps> = { children: 'test', onAnimationEnd: 'not-a-function' as any };
      const { errors } = validateTextMotionProps(props as TextMotionProps);

      expect(errors).toContain('onAnimationEnd prop must be a function');
    });

    it('should return an error for empty custom.name', () => {
      const props: Partial<TextMotionProps> = {
        children: 'test',
        motion: { custom: { name: '', duration: 1, delay: 0 } },
      };
      const { errors } = validateTextMotionProps(props as TextMotionProps);

      expect(errors).toContain('custom.name must be a non-empty string');
    });
  });
});

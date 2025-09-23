import type { NodeMotionProps, TextMotionProps } from '../../types';

import { validateNodeMotionProps, validateTextMotionProps } from './validation';

describe('validation utility', () => {
  describe('validateTextMotionProps', () => {
    it('should return no errors or warnings for valid props', () => {
      const props: TextMotionProps = {
        text: 'Hello World',
        split: 'word',
        trigger: 'on-load',
        repeat: true,
        initialDelay: 0,
        animationOrder: 'first-to-last',
        motion: { custom: { opacity: 0, y: 20, duration: 1, delay: 0.5 } },
      };
      const { errors, warnings } = validateTextMotionProps(props);

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(0);
    });

    it('should return errors for invalid common props', () => {
      const props: TextMotionProps = {
        text: 'hello',
        split: 'invalid' as any,
        trigger: 'click' as any,
        repeat: 'yes' as any,
        initialDelay: -5,
        animationOrder: 'reverse' as any,
        preset: 'fade-in' as any,
        onAnimationStart: 'Animation Start' as any,
        onAnimationEnd: 'Animation End' as any,
      };
      const { errors } = validateTextMotionProps(props);

      expect(errors).toEqual([
        'split prop must be one of: character, word, line',
        'trigger prop must be one of: on-load, scroll',
        'repeat prop must be a boolean',
        'initialDelay prop must be non-negative',
        'animationOrder prop must be one of: first-to-last, last-to-first',
        'preset prop must be an array',
        'onAnimationStart prop must be a function',
        'onAnimationEnd prop must be a function',
      ]);
    });

    it.each([
      { text: undefined, expected: 'text prop is required' },
      { text: null, expected: 'text prop is required' },
      { text: 123 as any, expected: 'text prop must be a string' },
    ])('should return error when text is invalid: %j', ({ text, expected }) => {
      const { errors } = validateTextMotionProps({ text } as any);
      expect(errors).toContain(expected);
    });

    it.each([
      { text: '', expected: 'text prop is empty or contains only whitespace' },
      { text: '   ', expected: 'text prop is empty or contains only whitespace' },
    ])('should warn for empty or whitespace text: %j', ({ text, expected }) => {
      const { warnings } = validateTextMotionProps({ text } as any);
      expect(warnings).toContain(expected);
    });

    it('should handle null or undefined motion config values', () => {
      const props: TextMotionProps = {
        text: 'hello',
        motion: {
          custom: undefined,
          another: null as any,
        },
      };
      const { errors, warnings } = validateTextMotionProps(props);

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(0);
    });

    it('should validate motion config with multiple keys', () => {
      const props: TextMotionProps = {
        text: 'hello',
        motion: {
          fade: { variant: 'in', duration: -1, delay: 0 },
          slide: { variant: 'up', duration: 15, delay: -3 },
        },
      };
      const { errors, warnings } = validateTextMotionProps(props);

      expect(errors).toEqual(['fade.duration must be greater than 0', 'slide.delay must be non-negative']);
      expect(warnings).toEqual(['slide.duration is very long (15s)']);
    });
  });

  describe('validateNodeMotionProps', () => {
    it('should return no errors or warnings for valid props', () => {
      const props: NodeMotionProps = {
        children: 'Hello World',
        split: 'word',
        trigger: 'scroll',
        repeat: false,
        initialDelay: 0,
        animationOrder: 'last-to-first',
        motion: { custom: { opacity: 0, duration: 1, delay: 0 } },
      };
      const { errors, warnings } = validateNodeMotionProps(props);

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(0);
    });

    it('should return a warning if children prop is empty', () => {
      const props = {} as NodeMotionProps;
      const { warnings } = validateNodeMotionProps(props);

      expect(warnings).toContain('children prop is empty');
    });

    it('should accept valid split values', () => {
      (['character', 'word'] as const).forEach(split => {
        const props: NodeMotionProps = { children: 'hello', split };
        const { errors } = validateNodeMotionProps(props);

        expect(errors).toHaveLength(0);
      });
    });

    it('should handle null or undefined motion config values', () => {
      const props: NodeMotionProps = {
        children: 'hello',
        motion: {
          custom: undefined,
          another: null as any,
        },
      };
      const { errors, warnings } = validateNodeMotionProps(props);

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(0);
    });

    it('should validate motion config errors and warnings together', () => {
      const props: NodeMotionProps = {
        children: 'hello',
        motion: {
          enter: { duration: 0, delay: -2 },
          exit: { duration: 20, delay: 0 },
        },
      };
      const { errors, warnings } = validateNodeMotionProps(props);

      expect(errors).toEqual(['enter.duration must be greater than 0', 'enter.delay must be non-negative']);
      expect(warnings).toEqual(['exit.duration is very long (20s)']);
    });
  });
});

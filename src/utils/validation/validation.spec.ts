import { NodeMotionProps, TextMotionProps } from '../../types';

import { validateNodeMotionProps, validateTextMotionProps } from './validation';

describe('validation utility', () => {
  describe('validateTextMotionProps', () => {
    it('should return no errors or warnings for valid props', () => {
      const props: TextMotionProps = {
        text: 'Hello World',
        split: 'word',
        motion: {
          custom: { opacity: 0, y: 20, duration: 1, delay: 0.5 },
        },
      };
      const { errors, warnings } = validateTextMotionProps(props);

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(0);
    });

    it('should return an error if text prop is undefined', () => {
      const props = {} as TextMotionProps;
      const { errors } = validateTextMotionProps(props);

      expect(errors).toContain('text prop is required');
    });

    it('should return an error if text prop is not a string', () => {
      const props = { text: 123 } as unknown as TextMotionProps;
      const { errors } = validateTextMotionProps(props);

      expect(errors).toContain('text prop must be a string');
    });

    it('should return a warning if text prop is an empty string', () => {
      const props: TextMotionProps = { text: '' };
      const { warnings } = validateTextMotionProps(props);

      expect(warnings).toContain('text prop is empty or contains only whitespace');
    });

    it('should return a warning if text prop contains only whitespace', () => {
      const props: TextMotionProps = { text: '   ' };
      const { warnings } = validateTextMotionProps(props);

      expect(warnings).toContain('text prop is empty or contains only whitespace');
    });

    it('should return an error for invalid split prop', () => {
      const props: TextMotionProps = { text: 'hello', split: 'sentence' as any };
      const { errors } = validateTextMotionProps(props);

      expect(errors).toContain('split prop must be one of: character, word, line');
    });

    it('should not return an error for valid split prop (character)', () => {
      const props: TextMotionProps = { text: 'hello', split: 'character' };
      const { errors } = validateTextMotionProps(props);

      expect(errors).not.toContain('split prop must be one of: character, word, line');
    });

    it('should not return an error for valid split prop (word)', () => {
      const props: TextMotionProps = { text: 'hello', split: 'word' };
      const { errors } = validateTextMotionProps(props);

      expect(errors).not.toContain('split prop must be one of: character, word, line');
    });

    it('should not return an error for valid split prop (line)', () => {
      const props: TextMotionProps = { text: 'hello', split: 'line' };
      const { errors } = validateTextMotionProps(props);

      expect(errors).not.toContain('split prop must be one of: character, word, line');
    });

    it('should return an error for negative duration in motion', () => {
      const props: TextMotionProps = {
        text: 'hello',
        motion: { custom: { duration: -1, delay: 0 } },
      };
      const { errors } = validateTextMotionProps(props);

      expect(errors).toContain('custom.duration must be greater than 0');
    });

    it('should return an error for negative delay in motion', () => {
      const props: TextMotionProps = {
        text: 'hello',
        motion: { custom: { delay: -1, duration: 1 } },
      };
      const { errors } = validateTextMotionProps(props);

      expect(errors).toContain('custom.delay must be non-negative');
    });

    it('should return a warning for very long duration in motion', () => {
      const props: TextMotionProps = {
        text: 'hello',
        motion: { custom: { duration: 11, delay: 0 } },
      };
      const { warnings } = validateTextMotionProps(props);

      expect(warnings).toContain('custom.duration is very long (11s)');
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
  });

  describe('validateNodeMotionProps', () => {
    it('should return no errors or warnings for valid props', () => {
      const props: NodeMotionProps = {
        children: 'Hello World',
        split: 'word',
        motion: {
          custom: { opacity: 0, duration: 1, delay: 0 },
        },
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

    it('should return an error for invalid split prop', () => {
      const props: NodeMotionProps = { children: 'hello', split: 'line' as any };
      const { errors } = validateNodeMotionProps(props);

      expect(errors).toContain('split prop must be one of: character, word');
    });

    it('should not return an error for valid split prop (character)', () => {
      const props: NodeMotionProps = { children: 'hello', split: 'character' };
      const { errors } = validateNodeMotionProps(props);

      expect(errors).not.toContain('split prop must be one of: character, word');
    });

    it('should not return an error for valid split prop (word)', () => {
      const props: NodeMotionProps = { children: 'hello', split: 'word' };
      const { errors } = validateNodeMotionProps(props);

      expect(errors).not.toContain('split prop must be one of: character, word');
    });

    it('should return an error for duration of 0 in motion', () => {
      const props: NodeMotionProps = {
        children: 'hello',
        motion: { custom: { duration: 0, delay: 0 } },
      };
      const { errors } = validateNodeMotionProps(props);

      expect(errors).toContain('custom.duration must be greater than 0');
    });

    it('should accumulate multiple errors and warnings', () => {
      const props: NodeMotionProps = {
        children: 'hello',
        split: 'invalid' as any,
        motion: {
          initial: { duration: -1, delay: 0 },
          animate: { delay: -5, duration: 20 },
        },
      };
      const { errors, warnings } = validateNodeMotionProps(props);

      expect(errors).toEqual([
        'split prop must be one of: character, word',
        'initial.duration must be greater than 0',
        'animate.delay must be non-negative',
      ]);
      expect(warnings).toEqual(['animate.duration is very long (20s)']);
    });
  });
});

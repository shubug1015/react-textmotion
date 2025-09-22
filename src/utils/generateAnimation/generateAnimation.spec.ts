import type { Motion } from '../../types';

import { generateAnimation } from './generateAnimation';

describe('generateAnimation utility', () => {
  describe('when given a valid motion configuration', () => {
    it('should generate a style object with a single motion string correctly for index 0', () => {
      const motion: Motion = {
        fade: { variant: 'in', duration: 2, delay: 1 },
      };
      const { style } = generateAnimation(motion, 0, 0);

      expect(style.animation).toBe('fade-in 2s ease-out 0s both');
    });

    it('should apply the correct staggered delay for a non-zero index', () => {
      const motion: Motion = {
        fade: { variant: 'out', duration: 1.5, delay: 0.5 },
      };
      const { style } = generateAnimation(motion, 2, 0);

      expect(style.animation).toBe('fade-out 1.5s ease-out 1s both');
    });

    it('should join multiple animation strings with a comma', () => {
      const motion: Motion = {
        fade: { variant: 'in', duration: 2, delay: 1 },
        slide: { variant: 'up', duration: 3, delay: 0.5 },
      };
      const { style } = generateAnimation(motion, 2, 0);

      expect(style.animation).toBe('fade-in 2s ease-out 2s both, slide-up 3s ease-out 1s both');
    });

    it('should apply a custom easing function if provided', () => {
      const motion: Motion = {
        fade: { variant: 'in', duration: 2, delay: 1, easing: 'ease-in-out' },
      };
      const { style } = generateAnimation(motion, 0, 0);

      expect(style.animation).toBe('fade-in 2s ease-in-out 0s both');
    });

    it('should generate CSS variables for dynamic properties', () => {
      const motion: Motion = {
        slide: { variant: 'up', duration: 1, delay: 0, distance: '100px' },
      };
      const { style } = generateAnimation(motion, 0, 0);

      expect(style).toHaveProperty('--slide-distance', '100px');
      expect(style.animation).toBe('slide-up 1s ease-out 0s both');
    });

    it('should not generate a CSS variable for a dynamic property with an undefined value', () => {
      const motion: Motion = {
        slide: { variant: 'up', duration: 1, delay: 0, distance: undefined },
      };
      const { style } = generateAnimation(motion, 0, 0);

      expect(style).not.toHaveProperty('--slide-distance');
      expect(style.animation).toBe('slide-up 1s ease-out 0s both');
    });
  });

  describe('when given an invalid or empty motion configuration', () => {
    const testCases: [string, Motion, string][] = [
      ['an empty motion object', {}, ''],
      [
        'a motion object with all invalid values',
        {
          fade: undefined as any,
          slide: { duration: 1, delay: 1 } as any, // missing variant
        },
        '',
      ],
      [
        'a motion object with mixed valid and invalid values',
        {
          fade: undefined as any,
          slide: { duration: 1, delay: 1 } as any,
          scale: { variant: 'in', duration: 1, delay: 1 },
        },
        'scale-in 1s ease-out 0s both',
      ],
    ];

    it.each(testCases)('should handle %s correctly', (_, motion, expected) => {
      const { style } = generateAnimation(motion, 0, 0);

      expect(style.animation).toBe(expected);
    });

    it('should ignore enumerable properties from the prototype chain', () => {
      const motionPrototype = {
        inheritedMotion: { variant: 'in', duration: 1, delay: 1 },
      };
      const motionsWithPrototype = Object.create(motionPrototype);

      motionsWithPrototype.ownMotion = { variant: 'out', duration: 2, delay: 0.5 };

      const { style } = generateAnimation(motionsWithPrototype, 1, 0);

      expect(style.animation).toBe('ownMotion-out 2s ease-out 0.5s both');
    });
  });
});

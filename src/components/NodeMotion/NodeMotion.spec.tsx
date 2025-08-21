import { cleanup, render, screen } from '@testing-library/react';

import { MotionConfig } from '../../types';

import { NodeMotion } from './NodeMotion';

afterEach(() => cleanup());

describe('NodeMotion component', () => {
  const TEXT = 'Hello';

  const getSpans = (label: string) => {
    const container = screen.getByLabelText(label);

    return container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');
  };

  describe('container rendering', () => {
    it('renders with correct aria-label', () => {
      render(<NodeMotion>{TEXT}</NodeMotion>);

      expect(screen.getByLabelText(TEXT)).toBeInTheDocument();
    });

    it('renders default as <span> tag', () => {
      render(<NodeMotion>{TEXT}</NodeMotion>);

      expect(screen.getByLabelText(TEXT).tagName.toLowerCase()).toBe('span');
    });

    it('renders custom tag via "as" prop', () => {
      render(<NodeMotion as="div">{TEXT}</NodeMotion>);

      expect(screen.getByLabelText(TEXT).tagName.toLowerCase()).toBe('div');
    });

    it('applies "motion" class', () => {
      render(<NodeMotion>{TEXT}</NodeMotion>);

      expect(screen.getByLabelText(TEXT)).toHaveClass('motion');
    });
  });

  describe('text extraction and splitting', () => {
    it('renders no spans for empty text', () => {
      render(<NodeMotion>{''}</NodeMotion>);

      expect(screen.getByLabelText('').querySelectorAll('span[aria-hidden="true"]').length).toBe(0);
    });

    it('handles numbers as children', () => {
      render(<NodeMotion>{123}</NodeMotion>);

      const spans = getSpans('123');

      expect(Array.from(spans, s => s.textContent)).toEqual(['1', '2', '3']);
    });

    it('handles nested React elements as children', () => {
      render(
        <NodeMotion>
          <span>
            A<strong>B</strong>
          </span>
        </NodeMotion>
      );

      const spans = getSpans('AB');

      expect(Array.from(spans, s => s.textContent)).toEqual(['A', 'B']);
    });

    it('returns empty string when children is null/undefined/boolean', () => {
      const { rerender } = render(<NodeMotion>{null}</NodeMotion>);

      expect(screen.getByLabelText('')).toBeInTheDocument();
      expect(getSpans('')).toHaveLength(0);

      rerender(<NodeMotion>{undefined}</NodeMotion>);

      expect(screen.getByLabelText('')).toBeInTheDocument();
      expect(getSpans('')).toHaveLength(0);

      rerender(<NodeMotion>{false}</NodeMotion>);

      expect(screen.getByLabelText('')).toBeInTheDocument();
      expect(getSpans('')).toHaveLength(0);
    });

    it('replaces spaces with non-breaking spaces', () => {
      render(<NodeMotion>{'A B'}</NodeMotion>);

      const spans = getSpans('A B');

      expect(spans[1].textContent).toBe('\u00A0');
    });

    it('splits into characters by default', () => {
      render(<NodeMotion>{TEXT}</NodeMotion>);

      const spans = getSpans(TEXT);

      expect(spans.length).toBe(TEXT.length);
      expect(Array.from(spans, s => s.textContent)).toEqual([...TEXT]);
    });

    it('splits into words when split="word"', () => {
      render(<NodeMotion split="word">{'Hello World'}</NodeMotion>);

      const spans = getSpans('Hello World');

      expect(Array.from(spans, s => s.textContent)).toEqual(['Hello', '\u00A0', 'World']);
    });
  });

  describe('animation styles', () => {
    it('has no animation style by default', () => {
      render(<NodeMotion>{TEXT}</NodeMotion>);

      getSpans(TEXT).forEach(span => {
        expect(span.style.animation).toBe('');
      });
    });

    it('applies fade motion with correct timing', () => {
      const motion: MotionConfig = { fade: { variant: 'in', duration: 1, delay: 0.5 } };

      render(<NodeMotion motion={motion}>{TEXT}</NodeMotion>);

      expect(getSpans(TEXT)[0].style.animation).toBe('fade-in 1s ease-out 0s both');
      expect(getSpans(TEXT)[1].style.animation).toBe('fade-in 1s ease-out 0.5s both');
    });

    it('applies slide motion with correct timing', () => {
      const motion: MotionConfig = { slide: { variant: 'up', duration: 2, delay: 0.25 } };

      render(<NodeMotion motion={motion}>{TEXT}</NodeMotion>);

      expect(getSpans(TEXT)[0].style.animation).toBe('slide-up 2s ease-out 0s both');
      expect(getSpans(TEXT)[1].style.animation).toBe('slide-up 2s ease-out 0.25s both');
    });

    it('applies multiple motions with correct animation', () => {
      const motion: MotionConfig = {
        fade: { variant: 'in', duration: 1, delay: 0 },
        slide: { variant: 'up', duration: 1.5, delay: 0.5 },
      };

      render(<NodeMotion motion={motion}>{TEXT}</NodeMotion>);

      expect(getSpans(TEXT)[1].style.animation).toBe('fade-in 1s ease-out 0s both, slide-up 1.5s ease-out 0.5s both');
    });
  });
});

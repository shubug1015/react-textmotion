import { cleanup, render, screen } from '@testing-library/react';

import { MotionConfig, TextMotion } from './TextMotion';

afterEach(() => cleanup());

describe('TextMotion component', () => {
  const TEXT = 'Hello';

  const getSpans = (label: string) => {
    const elements = screen.getAllByLabelText(label);
    const container = elements[elements.length - 1];

    return container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');
  };

  describe('container rendering', () => {
    it('renders with correct aria-label', () => {
      render(<TextMotion text={TEXT} />);

      expect(screen.getByLabelText(TEXT)).toBeInTheDocument();
    });

    it('renders default as <span> tag', () => {
      render(<TextMotion text={TEXT} />);

      expect(screen.getByLabelText(TEXT).tagName.toLowerCase()).toBe('span');
    });

    it('renders custom tag via "as" prop', () => {
      render(<TextMotion as="div" text={TEXT} />);

      expect(screen.getByLabelText(TEXT).tagName.toLowerCase()).toBe('div');
    });

    it('applies "text-motion" class', () => {
      render(<TextMotion text={TEXT} />);

      expect(screen.getByLabelText(TEXT)).toHaveClass('text-motion');
    });
  });

  describe('text splitting and rendering', () => {
    it('renders no spans for empty text', () => {
      render(<TextMotion text="" />);

      const container = screen.getByLabelText('');

      expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBe(0);
    });

    it('replaces spaces with non-breaking spaces', () => {
      render(<TextMotion text="A B" />);

      const spans = getSpans('A B');

      expect(spans[1].textContent).toBe('\u00A0');
    });

    it('splits into characters by default', () => {
      render(<TextMotion text={TEXT} />);

      const spans = getSpans(TEXT);

      expect(spans.length).toBe(TEXT.length);
      expect(Array.from(spans, s => s.textContent)).toEqual([...TEXT]);
    });

    it('splits into words when split="word"', () => {
      render(<TextMotion text="Hello World" split="word" />);

      const spans = getSpans('Hello World');

      expect(Array.from(spans, s => s.textContent)).toEqual(['Hello', '\u00A0', 'World']);
    });
  });

  describe('animation styles', () => {
    it('has no animation style by default', () => {
      render(<TextMotion text={TEXT} />);

      const spans = getSpans(TEXT);

      spans.forEach(span => {
        expect(span.style.animation).toBe('');
      });
    });

    it('applies fade motion with correct timing', () => {
      const motion: MotionConfig = { fade: { variant: 'in', duration: 1, delay: 0.5 } };

      render(<TextMotion text={TEXT} motion={motion} />);

      expect(getSpans(TEXT)[0].style.animation).toBe('fade-in 1s ease-out 0s both');
      expect(getSpans(TEXT)[1].style.animation).toBe('fade-in 1s ease-out 0.5s both');
    });

    it('applies slide motion with correct timing', () => {
      const motion: MotionConfig = { slide: { variant: 'up', duration: 2, delay: 0.25 } };

      render(<TextMotion text={TEXT} motion={motion} />);

      expect(getSpans(TEXT)[0].style.animation).toBe('slide-up 2s ease-out 0s both');
      expect(getSpans(TEXT)[1].style.animation).toBe('slide-up 2s ease-out 0.25s both');
    });

    it('applies multiple motions with correct animation', () => {
      const motion: MotionConfig = {
        fade: { variant: 'out', duration: 1, delay: 0 },
        slide: { variant: 'left', duration: 1.5, delay: 0.5 },
      };

      render(<TextMotion text={TEXT} motion={motion} />);

      expect(getSpans(TEXT)[1].style.animation).toBe(
        'fade-out 1s ease-out 0s both, slide-left 1.5s ease-out 0.5s both'
      );
    });
  });
});

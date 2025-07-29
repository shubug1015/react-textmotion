import { cleanup, render, screen } from '@testing-library/react';

import { splitText, TextMotion } from './TextMotion';

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
    it('applies default "fade" animation with proper timing', () => {
      render(<TextMotion text={TEXT} />);

      const span = getSpans(TEXT)[0];
      const anim = span.style.animation;

      expect(anim).toContain('fade');
      expect(anim).toContain('0.25s');
      expect(anim).toContain('0s');
    });

    it('applies incremental delay between spans', () => {
      render(<TextMotion text={TEXT} />);

      const spans = getSpans(TEXT);

      expect(Array.from(spans, s => s.style.animation.match(/(\d*\.?\d+s)(?=\s+both)/)?.[1] ?? '')).toEqual([
        '0s',
        '0.025s',
        '0.05s',
        '0.075s',
        '0.1s',
      ]);
    });

    it.each([
      [['fade'], ['fade']],
      [['slide'], ['slide']],
      [
        ['fade', 'slide'],
        ['fade', 'slide'],
      ],
    ])('applies custom presets %p', (presets, expected) => {
      render(<TextMotion text={TEXT} presets={presets as any} />);

      const anim = getSpans(TEXT)[0].style.animation;

      expected.forEach(p => expect(anim).toContain(p));
    });
  });
});

describe('splitText utility', () => {
  it.each([
    ['character', 'Hello', ['H', 'e', 'l', 'l', 'o']],
    ['word', 'Hello World', ['Hello', ' ', 'World']],
    ['invalid' as any, 'Hi', ['H', 'i']],
  ])('splits "%s" correctly', (split, input, expected) => {
    expect(splitText(input, split as any)).toEqual(expected);
  });
});

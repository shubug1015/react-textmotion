import { render, screen } from '@testing-library/react';

import { splitText, TextMotion } from './TextMotion';

describe('TextMotion component', () => {
  const getSpans = (label: string) =>
    screen.getByLabelText(label).querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

  it('renders the container with correct aria-label', () => {
    render(<TextMotion text="Hello" />);

    expect(screen.getByLabelText('Hello')).toBeInTheDocument();
  });

  it('renders default tag as <span>', () => {
    render(<TextMotion text="Hello" />);

    expect(screen.getByLabelText('Hello').tagName.toLowerCase()).toBe('span');
  });

  it('renders custom tag via "as" prop', () => {
    render(<TextMotion as="div" text="Hello" />);

    expect(screen.getByLabelText('Hello').tagName.toLowerCase()).toBe('div');
  });

  it('applies the "text-motion" class to the container', () => {
    render(<TextMotion text="Hello" />);

    expect(screen.getByLabelText('Hello')).toHaveClass('text-motion');
  });

  it('renders no spans when text is empty', () => {
    render(<TextMotion text="" />);

    expect(getSpans('').length).toBe(0);
  });

  it('renders non-breaking space for whitespace characters', () => {
    render(<TextMotion text="A B" />);

    const spans = getSpans('A B');

    expect(spans[1].textContent).toBe('\u00A0');
  });

  it('splits text into characters by default', () => {
    render(<TextMotion text="Hello" />);

    const spans = getSpans('Hello');

    expect(spans.length).toBe(5);
    expect(spans[0].textContent).toBe('H');
    expect(spans[1].textContent).toBe('e');
    expect(spans[2].textContent).toBe('l');
    expect(spans[3].textContent).toBe('l');
    expect(spans[4].textContent).toBe('o');
  });

  it('splits text into words when split="word"', () => {
    render(<TextMotion text="Hello World" split="word" />);

    const spans = getSpans('Hello World');
    const contents = Array.from(spans).map(s => s.textContent);

    expect(contents).toEqual(['Hello', '\u00A0', 'World']);
  });

  it('applies correct animation style (duration, delay)', () => {
    render(<TextMotion text="Hello" />);

    const spans = getSpans('Hello');

    expect(spans[0].style.getPropertyValue('--duration')).toBe('0.25s');
    expect(spans[0].style.getPropertyValue('--delay')).toBe('0s');
    expect(spans[1].style.getPropertyValue('--delay')).toBe('0.025s');
  });

  it('applies correct style for word-split', () => {
    render(<TextMotion text="Hello World" split="word" />);

    const spans = getSpans('Hello World');

    expect(spans[0].style.getPropertyValue('--delay')).toBe('0s');
    expect(spans[1].style.getPropertyValue('--delay')).toBe('0.025s');
    expect(spans[2].style.getPropertyValue('--delay')).toBe('0.05s');
  });
});

describe('splitText utility', () => {
  it('splits by character', () => {
    expect(splitText('Hello', 'character')).toEqual(['H', 'e', 'l', 'l', 'o']);
  });

  it('splits by word (preserving spaces)', () => {
    expect(splitText('Hello World', 'word')).toEqual(['Hello', ' ', 'World']);
  });

  it('falls back to character split on invalid input', () => {
    expect(splitText('Hello', 'invalid' as any)).toEqual(['H', 'e', 'l', 'l', 'o']);
  });
});

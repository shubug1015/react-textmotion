import { render, screen } from '@testing-library/react';

import { TextMotion } from './TextMotion';

describe('TextMotion', () => {
  it('renders container with aria-label equal to text prop', () => {
    render(<TextMotion text="Test" />);

    const container = screen.getByLabelText('Test');

    expect(container).toBeInTheDocument();
  });

  it('renders with custom tag', () => {
    render(<TextMotion as="div" text="Test" />);

    const container = screen.getByLabelText('Test');

    expect(container.tagName.toLowerCase()).toBe('div');
  });

  it('renders non-breaking spaces for spaces', () => {
    render(<TextMotion text="A B" />);

    const spans = screen.getByLabelText('A B').querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(3);
    expect(spans[1].textContent).toBe('\u00A0');
  });

  it('renders no spans for empty string', () => {
    render(<TextMotion text="" />);

    const spans = screen.getByLabelText('').querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(0);
  });

  it('defaults to span tag', () => {
    render(<TextMotion text="A" />);

    const container = screen.getByLabelText('A');

    expect(container.tagName.toLowerCase()).toBe('span');
  });

  it('applies correct animation style for each character', () => {
    render(<TextMotion text="AB" />);

    const spans = screen.getByLabelText('AB').querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans[0].style.getPropertyValue('--duration')).toBe('0.25s');
    expect(spans[0].style.getPropertyValue('--delay')).toBe('0s');
    expect(spans[1].style.getPropertyValue('--duration')).toBe('0.25s');
    expect(spans[1].style.getPropertyValue('--delay')).toBe('0.025s');
  });
});

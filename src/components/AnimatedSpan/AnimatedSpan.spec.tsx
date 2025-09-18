import { render } from '@testing-library/react';

import { AnimatedSpan } from './AnimatedSpan';

describe('AnimatedSpan component', () => {
  const TEXT = 'Hi';
  const STYLE = { animation: 'fade-in 1s ease-out 0.5s both' };

  const renderSpan = (text: string, style: any = STYLE) => {
    const { container, getByText } = render(<AnimatedSpan text={text} style={style} />);

    return { container, getByText, span: container.querySelector('span') as HTMLSpanElement | null };
  };

  it('renders a <span> element with aria-hidden="true"', () => {
    const { span } = renderSpan(TEXT);

    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders span with correct text content', () => {
    const { span } = renderSpan(TEXT);

    expect(span).toHaveTextContent(TEXT);
  });

  it('applies animation style from motion config', () => {
    const { span } = renderSpan(TEXT);

    expect(span).toHaveStyle({ animation: 'fade-in 1s ease-out 0.5s both' });
  });

  it('renders <br> when text is newline character', () => {
    const { container } = renderSpan('\n');

    expect(container.querySelector('br')).toBeInTheDocument();
  });

  it('renders empty span when text is empty string', () => {
    const { span } = renderSpan('');

    expect(span).toBeInTheDocument();
    expect(span).toBeEmptyDOMElement();
  });

  it('renders span with whitespace correctly', () => {
    const { span } = renderSpan(' ');

    expect(span).not.toBeNull();
    if (span) {
      expect(span.textContent).toBe(' ');
    }
  });

  it('does not apply animation style when motion config is empty', () => {
    const { span } = renderSpan(TEXT, {});

    expect(span?.style.animation).toBe('');
  });

  it('applies multiple animations when multiple motions are provided', () => {
    const style = {
      animation: 'fade-in 1s ease-out 0.5s both, slide-up 1.5s ease-out 1s both',
    };
    const { span } = renderSpan(TEXT, style);

    expect(span?.style.animation).toContain('fade-in');
    expect(span?.style.animation).toContain('slide-up');
  });

  it('handles undefined style gracefully', () => {
    const { container } = render(<AnimatedSpan text={TEXT} style={undefined as any} />);
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span?.style.animation).toBe('');
  });
});

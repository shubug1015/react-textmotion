import { render } from '@testing-library/react';

import { MotionConfig } from '../../types';
import { createAnimatedSpan } from '../createAnimatedSpan';

describe('createAnimatedSpan utility', () => {
  const TEXT = 'Hi';

  it('renders a <span> element with aria-hidden="true"', () => {
    const motion: MotionConfig = {};
    const element = createAnimatedSpan(TEXT, 0, motion);

    const { container } = render(element);
    const span = container.querySelector('span') as HTMLSpanElement;

    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders span with correct text content', () => {
    const motion: MotionConfig = {};
    const element = createAnimatedSpan(TEXT, 0, motion);

    const { getByText } = render(element);

    expect(getByText(TEXT)).toBeInTheDocument();
  });

  it('applies animation style from motion config', () => {
    const motion: MotionConfig = { fade: { variant: 'in', duration: 1, delay: 0.2 } };
    const element = createAnimatedSpan(TEXT, 1, motion);

    const { container } = render(element);
    const span = container.querySelector('span') as HTMLSpanElement;

    expect(span.style.animation).toContain('fade-in 1s ease-out 0.2s both');
  });

  it('renders <br> when text is newline character', () => {
    const motion: MotionConfig = {};
    const element = createAnimatedSpan('\n', 0, motion);

    const { container } = render(element);
    const br = container.querySelector('br');

    expect(br).toBeInTheDocument();
  });

  it('renders span with unique key for sequence index', () => {
    const motion: MotionConfig = {};
    const element1 = createAnimatedSpan('A', 0, motion);
    const element2 = createAnimatedSpan('B', 1, motion);

    const { container: c1 } = render(element1);
    const { container: c2 } = render(element2);

    expect(c1.innerHTML).not.toEqual(c2.innerHTML);
  });

  it('does not apply animation style when motion config is empty', () => {
    const motion: MotionConfig = {};
    const element = createAnimatedSpan(TEXT, 0, motion);

    const { container } = render(element);
    const span = container.querySelector('span') as HTMLSpanElement;

    expect(span.style.animation).toBe('');
  });

  it('applies multiple animations when multiple motions are provided', () => {
    const motion: MotionConfig = {
      fade: { variant: 'in', duration: 1, delay: 0 },
      slide: { variant: 'up', duration: 1.5, delay: 0.5 },
    };

    const element = createAnimatedSpan(TEXT, 1, motion);

    const { container } = render(element);
    const span = container.querySelector('span') as HTMLSpanElement;

    expect(span.style.animation).toContain('fade-in 1s ease-out 0s both');
    expect(span.style.animation).toContain('slide-up 1.5s ease-out 0.5s both');
  });
});

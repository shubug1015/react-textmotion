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
});

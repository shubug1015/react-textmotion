import { render } from '@testing-library/react';

import { MotionConfig } from '../../types';
import { AnimatedSpan } from '../AnimatedSpan';

describe('AnimatedSpan component', () => {
  const TEXT = 'Hi';

  it('renders a <span> element with aria-hidden="true"', () => {
    const motion: MotionConfig = {};
    const { container } = render(<AnimatedSpan text={TEXT} sequenceIndex={0} motion={motion} />);
    const span = container.querySelector('span') as HTMLSpanElement;

    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders span with correct text content', () => {
    const motion: MotionConfig = {};
    const { getByText } = render(<AnimatedSpan text={TEXT} sequenceIndex={0} motion={motion} />);

    expect(getByText(TEXT)).toBeInTheDocument();
  });

  it('applies animation style from motion config', () => {
    const motion: MotionConfig = { fade: { variant: 'in', duration: 1, delay: 0.2 } };
    const { container } = render(<AnimatedSpan text={TEXT} sequenceIndex={1} motion={motion} />);
    const span = container.querySelector('span') as HTMLSpanElement;

    expect(span.style.animation).toContain('fade-in 1s ease-out 0.2s both');
  });

  it('renders <br> when text is newline character', () => {
    const motion: MotionConfig = {};
    const { container } = render(<AnimatedSpan text={'\n'} sequenceIndex={0} motion={motion} />);
    const br = container.querySelector('br');

    expect(br).toBeInTheDocument();
  });

  it('renders span with unique key for sequence index', () => {
    const motion: MotionConfig = {};
    const { container: c1 } = render(<AnimatedSpan text="A" sequenceIndex={0} motion={motion} />);
    const { container: c2 } = render(<AnimatedSpan text="B" sequenceIndex={1} motion={motion} />);

    expect(c1.innerHTML).not.toEqual(c2.innerHTML);
  });

  it('does not apply animation style when motion config is empty', () => {
    const motion: MotionConfig = {};
    const { container } = render(<AnimatedSpan text={TEXT} sequenceIndex={0} motion={motion} />);
    const span = container.querySelector('span') as HTMLSpanElement;

    expect(span.style.animation).toBe('');
  });

  it('applies multiple animations when multiple motions are provided', () => {
    const motion: MotionConfig = {
      fade: { variant: 'in', duration: 1, delay: 0 },
      slide: { variant: 'up', duration: 1.5, delay: 0.5 },
    };

    const { container } = render(<AnimatedSpan text={TEXT} sequenceIndex={1} motion={motion} />);
    const span = container.querySelector('span') as HTMLSpanElement;

    expect(span.style.animation).toContain('fade-in 1s ease-out 0s both');
    expect(span.style.animation).toContain('slide-up 1.5s ease-out 0.5s both');
  });
});

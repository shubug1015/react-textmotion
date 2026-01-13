import { type FC, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import { DEFAULT_ARIA_LABEL } from '../../constants';
import * as useTextMotionAnimation from '../../hooks/useTextMotionAnimation';

import { TextMotion } from './TextMotion';

jest.mock('../../hooks/useTextMotionAnimation', () => ({
  useTextMotionAnimation: jest.fn(() => ({
    shouldAnimate: false,
    targetRef: { current: null },
    animatedChildren: [],
    text: '',
  })),
}));

// Helper to drive component scenarios by mocking the hook return
const MockTextMotion: FC<{
  children: ReactNode;
  hookReturn?: Partial<ReturnType<typeof useTextMotionAnimation.useTextMotionAnimation>>;
  onAnimationStart?: () => void;
}> = ({ children, hookReturn, onAnimationStart }) => {
  (useTextMotionAnimation.useTextMotionAnimation as unknown as jest.Mock).mockReturnValueOnce({
    shouldAnimate: false,
    targetRef: { current: null },
    animatedChildren: [],
    text: typeof children === 'string' ? children : '',
    ...hookReturn,
  });

  return <TextMotion onAnimationStart={onAnimationStart}>{children}</TextMotion>;
};

describe('TextMotion component', () => {
  const TEXT = 'Hello';
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const useTextMotionAnimationSpy = jest.spyOn(useTextMotionAnimation, 'useTextMotionAnimation');

  beforeEach(() => {
    consoleWarnSpy.mockClear();
    useTextMotionAnimationSpy.mockClear();
  });

  it('should call useTextMotionAnimation with default trigger and repeat', () => {
    render(<TextMotion trigger="scroll">{TEXT}</TextMotion>);

    expect(useTextMotionAnimationSpy).toHaveBeenCalledWith(
      expect.objectContaining({ children: 'Hello', trigger: 'scroll' })
    );
  });

  it('should respect the repeat prop when provided', () => {
    render(
      <TextMotion trigger="scroll" repeat={false}>
        {TEXT}
      </TextMotion>
    );

    expect(useTextMotionAnimationSpy).toHaveBeenCalledWith(
      expect.objectContaining({ trigger: 'scroll', repeat: false })
    );
  });

  it('renders spans when shouldAnimate is true (e.g., trigger="on-load")', () => {
    const animatedChildren = Array.from(TEXT).map((ch, i) => (
      <span key={i} aria-hidden="true">
        {ch}
      </span>
    ));

    render(<MockTextMotion hookReturn={{ shouldAnimate: true, text: TEXT, animatedChildren }}>{TEXT}</MockTextMotion>);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(TEXT.length);
    expect(container).toHaveClass('text-motion');
  });

  it('renders plain text when shouldAnimate is false', () => {
    render(<MockTextMotion hookReturn={{ shouldAnimate: false, text: TEXT }}>{TEXT}</MockTextMotion>);

    const container = screen.getByText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(container.textContent).toBe(TEXT);
    expect(spans.length).toBe(0);
    expect(container).toHaveClass('text-motion-inanimate');
  });

  it('renders spans when shouldAnimate is true', () => {
    const animatedChildren = Array.from(TEXT).map((ch, i) => (
      <span key={i} aria-hidden="true">
        {ch}
      </span>
    ));

    render(<MockTextMotion hookReturn={{ shouldAnimate: true, text: TEXT, animatedChildren }}>{TEXT}</MockTextMotion>);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(TEXT.length);
    expect(container).toHaveClass('text-motion');
  });

  it('warns when children is empty null/undefined', () => {
    render(<TextMotion>{null}</TextMotion>);

    expect(consoleWarnSpy).toHaveBeenCalled();

    render(<TextMotion>{undefined}</TextMotion>);

    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('uses DEFAULT_ARIA_LABEL when text is empty while animating', () => {
    render(<MockTextMotion hookReturn={{ shouldAnimate: true, text: '', animatedChildren: [] }}>{''}</MockTextMotion>);

    const container = screen.getByLabelText(DEFAULT_ARIA_LABEL);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(0);
  });

  it('explicitly verifies aria-label when animating with empty text', () => {
    render(<MockTextMotion hookReturn={{ shouldAnimate: true, text: '', animatedChildren: [] }}>{''}</MockTextMotion>);
    const animatedContainer = screen.getByLabelText(DEFAULT_ARIA_LABEL);

    expect(animatedContainer).toBeInTheDocument();
    expect(animatedContainer).toHaveClass('text-motion');
  });

  it('uses DEFAULT_ARIA_LABEL when not animating and text is falsy', () => {
    render(<MockTextMotion hookReturn={{ shouldAnimate: false, text: '' }}>{null}</MockTextMotion>);

    const container = screen.getByLabelText(DEFAULT_ARIA_LABEL);
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('text-motion-inanimate');
  });

  it('calls onAnimationStart when shouldAnimate is true', () => {
    const onAnimationStart = jest.fn();

    render(
      <MockTextMotion hookReturn={{ shouldAnimate: true, text: TEXT }} onAnimationStart={onAnimationStart}>
        {TEXT}
      </MockTextMotion>
    );

    expect(onAnimationStart).toHaveBeenCalledTimes(1);
  });

  it('does not call onAnimationStart when shouldAnimate is false', () => {
    const onAnimationStart = jest.fn();

    render(
      <MockTextMotion hookReturn={{ shouldAnimate: false, text: TEXT }} onAnimationStart={onAnimationStart}>
        {TEXT}
      </MockTextMotion>
    );

    expect(onAnimationStart).not.toHaveBeenCalled();
  });

  it('calls onAnimationStart when shouldAnimate is true (e.g., intersecting)', () => {
    const onAnimationStart = jest.fn();

    render(
      <MockTextMotion hookReturn={{ shouldAnimate: true, text: TEXT }} onAnimationStart={onAnimationStart}>
        {TEXT}
      </MockTextMotion>
    );

    expect(onAnimationStart).toHaveBeenCalledTimes(1);
  });
});

describe('TextMotion with different split options (component-level via hook mock)', () => {
  it('should render character-split spans when hook provides them', () => {
    const animatedChildren = ['H', 'i'].map((ch, i) => (
      <span key={i} aria-hidden="true">
        {ch}
      </span>
    ));

    render(<MockTextMotion hookReturn={{ shouldAnimate: true, text: 'Hi', animatedChildren }}>Hi</MockTextMotion>);

    const container = screen.getByLabelText('Hi');
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe('H');
    expect(spans[1].textContent).toBe('i');
  });

  it('should render word-split spans when hook provides them (including space unit)', () => {
    const animatedChildren = ['Hello', ' ', 'World'].map((ch, i) => (
      <span key={i} aria-hidden="true">
        {ch}
      </span>
    ));

    render(
      <MockTextMotion hookReturn={{ shouldAnimate: true, text: 'Hello World', animatedChildren }}>
        Hello World
      </MockTextMotion>
    );

    const container = screen.getByLabelText('Hello World');
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(3);
    expect(spans[0].textContent).toBe('Hello');
    expect(spans[1].textContent).toBe(' ');
    expect(spans[2].textContent).toBe('World');
  });

  // it('should split by line, rendering <br> for newlines', () => {
  //   const textWithLineBreak = 'Hello\nWorld';

  //   render(
  //     <TextMotion trigger="on-load" split="line" data-testid="line-split">
  //       {textWithLineBreak}
  //     </TextMotion>
  //   );

  //   const container = screen.getByTestId('line-split');
  //   const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

  //   expect(spans.length).toBe(2);
  //   expect(spans[0].textContent).toBe('Hello');
  //   expect(spans[1].textContent).toBe('World');
  //   expect(container.querySelector('br')).not.toBeNull();

  //   expect(container.childNodes[0]).toBe(spans[0]);
  //   expect(container.childNodes[1].nodeName).toBe('BR');
  //   expect(container.childNodes[2]).toBe(spans[1]);
  // });

  it('should handle complex children rendering with provided animatedChildren', () => {
    const animatedChildren = ['Hello', ' ', 'World', '!'].map((ch, i) => (
      <span key={i} aria-hidden="true">
        {ch}
      </span>
    ));

    render(
      <MockTextMotion hookReturn={{ shouldAnimate: true, text: 'Hello World!', animatedChildren }}>
        Hello <strong>World</strong>!
      </MockTextMotion>
    );

    const container = screen.getByLabelText('Hello World!');
    const animatedSpans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(animatedSpans.length).toBe(4);
    expect(animatedSpans[0].textContent).toBe('Hello');
    expect(animatedSpans[1].textContent).toBe(' ');
    expect(animatedSpans[2].textContent).toBe('World');
    expect(animatedSpans[3].textContent).toBe('!');
  });

  // it('should warn when using split="line" with non-string children', () => {
  //   const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  //   render(
  //     <TextMotion trigger="on-load" split="line">
  //       Hello <strong>World</strong>
  //     </TextMotion>
  //   );

  //   expect(consoleWarnSpy).toHaveBeenCalledWith(
  //     'TextMotion validation warnings:',
  //     expect.arrayContaining(['split="line" is only applicable when children is a string.'])
  //   );

  //   consoleWarnSpy.mockRestore();
  // });
});

import { type FC, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import * as useIntersectionObserver from '../../hooks/useIntersectionObserver';

import { TextMotion } from './TextMotion';

jest.mock('../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: jest.fn(() => [{ current: null }, false]),
}));

describe('TextMotion component', () => {
  const TEXT = 'Hello';
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const useIntersectionObserverSpy = jest.spyOn(useIntersectionObserver, 'useIntersectionObserver');

  beforeEach(() => {
    consoleWarnSpy.mockClear();
    useIntersectionObserverSpy.mockClear();
  });

  const MockTextMotion: FC<{ children: ReactNode; isIntersecting?: boolean }> = ({
    children,
    isIntersecting = false,
  }) => {
    useIntersectionObserverSpy.mockReturnValueOnce([{ current: null }, isIntersecting]);

    return <TextMotion>{children}</TextMotion>;
  };

  it('should call useIntersectionObserver with repeat: true by default when trigger is scroll', () => {
    render(<TextMotion trigger="scroll">{TEXT}</TextMotion>);

    expect(useIntersectionObserverSpy).toHaveBeenCalledWith({ repeat: true });
  });

  it('should respect the repeat prop when provided', () => {
    render(
      <TextMotion trigger="scroll" repeat={false}>
        {TEXT}
      </TextMotion>
    );

    expect(useIntersectionObserverSpy).toHaveBeenCalledWith({ repeat: false });
  });

  it('renders spans immediately when trigger="on-load"', () => {
    render(<TextMotion trigger="on-load">{TEXT}</TextMotion>);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(TEXT.length);
  });

  it('renders plain text when not intersecting', () => {
    render(<MockTextMotion>{TEXT}</MockTextMotion>);

    const container = screen.getByText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(container.textContent).toBe(TEXT);
    expect(spans.length).toBe(0);
  });

  it('renders spans when intersecting', () => {
    render(<MockTextMotion isIntersecting>{TEXT}</MockTextMotion>);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(TEXT.length);
  });

  it('warns when children is empty null/undefined', () => {
    render(<TextMotion>{null}</TextMotion>);

    expect(consoleWarnSpy).toHaveBeenCalled();

    render(<TextMotion>{undefined}</TextMotion>);

    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});

describe('TextMotion with different split options', () => {
  it('should split by character', () => {
    render(
      <TextMotion trigger="on-load" split="character">
        Hi
      </TextMotion>
    );
    const container = screen.getByLabelText('Hi');
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');
    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe('H');
    expect(spans[1].textContent).toBe('i');
  });

  it('should split by word, including spaces as units', () => {
    render(
      <TextMotion trigger="on-load" split="word">
        Hello World
      </TextMotion>
    );
    const container = screen.getByLabelText('Hello World');
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');
    expect(spans.length).toBe(3);
    expect(spans[0].textContent).toBe('Hello');
    expect(spans[1].textContent).toBe(' ');
    expect(spans[2].textContent).toBe('World');
  });

  it('should split by line, rendering <br> for newlines', () => {
    const textWithLineBreak = 'Hello\nWorld';
    render(
      <TextMotion trigger="on-load" split="line" data-testid="line-split">
        {textWithLineBreak}
      </TextMotion>
    );
    const container = screen.getByTestId('line-split');
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    // It renders 2 spans for 'Hello' and 'World', and one <br /> for the newline.
    // The <br/> is NOT wrapped in a span.
    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe('Hello');
    expect(spans[1].textContent).toBe('World');
    expect(container.querySelector('br')).not.toBeNull();
    // Check order
    expect(container.childNodes[0]).toBe(spans[0]);
    expect(container.childNodes[1].nodeName).toBe('BR');
    expect(container.childNodes[2]).toBe(spans[1]);
  });

  it('should handle complex children with splitting', () => {
    render(
      <TextMotion trigger="on-load" split="word">
        Hello <strong>World</strong>!
      </TextMotion>
    );
    const container = screen.getByLabelText('Hello World!');
    const animatedSpans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(animatedSpans.length).toBe(4);
    expect(animatedSpans[0].textContent).toBe('Hello');
    expect(animatedSpans[1].textContent).toBe(' ');
    expect(animatedSpans[2].textContent).toBe('World');
    expect(animatedSpans[3].textContent).toBe('!');

    // Check that the 'strong' tag is preserved in the structure
    const strongTag = container.querySelector('strong');
    expect(strongTag).not.toBeNull();
    // And that it contains the correct animated span
    expect(strongTag!.contains(animatedSpans[2])).toBe(true);
  });

  it('should warn when using split="line" with non-string children', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <TextMotion trigger="on-load" split="line">
        Hello <strong>World</strong>
      </TextMotion>
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'TextMotion validation warnings:',
      expect.arrayContaining(['split="line" is only applicable when children is a string.'])
    );
    consoleWarnSpy.mockRestore();
  });
});

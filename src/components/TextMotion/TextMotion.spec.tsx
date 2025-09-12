import { act, cleanup, render, screen } from '@testing-library/react';

import { TextMotion } from './TextMotion';

declare const window: any;

afterEach(() => cleanup());

describe('TextMotion component', () => {
  const TEXT = 'Hello';
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const getSpans = (label: string) => {
    const container = screen.getByLabelText(label);

    return container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');
  };

  beforeEach(() => {
    consoleWarnSpy.mockClear();

    window.IntersectionObserver = jest.fn(cb => {
      (window as any).__trigger = (isIntersecting: boolean) =>
        cb([{ isIntersecting, target: document.createElement('div') }]);

      return { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() };
    });
  });

  describe('trigger behavior', () => {
    it('renders spans immediately when trigger="on-load"', () => {
      render(<TextMotion text={TEXT} trigger="on-load" />);

      expect(getSpans(TEXT).length).toBe(TEXT.length);
    });

    it('renders raw text when trigger="scroll" before intersection', () => {
      render(<TextMotion text={TEXT} trigger="scroll" />);

      const container = screen.getByLabelText(TEXT);

      expect(container.textContent).toBe(TEXT);
      expect(getSpans(TEXT).length).toBe(0);
    });

    it('renders spans when trigger="scroll" after intersection', () => {
      render(<TextMotion text={TEXT} trigger="scroll" />);

      act(() => {
        (window as any).__trigger(true);
      });

      expect(getSpans(TEXT).length).toBe(TEXT.length);
    });
  });

  describe('preset behavior', () => {
    it('applies animation styles from preset', () => {
      render(<TextMotion text={TEXT} preset={['fade-in']} trigger="on-load" />);

      const spans = getSpans(TEXT);

      expect(spans[0].style.animation).toMatch(/fade-in/);
    });

    it('applies multiple preset animations correctly', () => {
      render(<TextMotion text={TEXT} preset={['fade-in', 'slide-up']} trigger="on-load" />);

      const span = getSpans(TEXT)[0];

      expect(span.style.animation).toContain('fade-in');
      expect(span.style.animation).toContain('slide-up');
    });
  });

  describe('validation and warnings', () => {
    it('warns when text is empty', () => {
      render(<TextMotion text="" />);

      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});

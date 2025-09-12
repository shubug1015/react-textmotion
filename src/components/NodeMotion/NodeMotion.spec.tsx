import { act, cleanup, render, screen } from '@testing-library/react';

import { NodeMotion } from './NodeMotion';

declare const window: any;

afterEach(() => cleanup());

describe('NodeMotion component', () => {
  const TEXT = 'Hello';
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const getSpans = (label: string) => {
    const container = screen.getByLabelText(label);

    return container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');
  };

  beforeEach(() => {
    consoleWarnSpy.mockClear();

    const observe = jest.fn();
    const unobserve = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(callback => {
      (window as any).__trigger = (isIntersecting: boolean) =>
        callback([{ isIntersecting, target: document.createElement('div') }]);

      return { observe, unobserve, disconnect };
    });
  });

  describe('trigger behavior', () => {
    it('renders spans immediately when trigger="on-load"', () => {
      render(<NodeMotion trigger="on-load">{TEXT}</NodeMotion>);

      expect(getSpans(TEXT).length).toBe(TEXT.length);
    });

    it('renders plain text when trigger="scroll" before intersection', () => {
      render(<NodeMotion trigger="scroll">{TEXT}</NodeMotion>);

      const container = screen.getByLabelText(TEXT);

      expect(container.textContent).toBe(TEXT);
      expect(getSpans(TEXT).length).toBe(0);
    });

    it('renders spans when trigger="scroll" after intersection', () => {
      render(<NodeMotion trigger="scroll">{TEXT}</NodeMotion>);

      act(() => {
        (window as any).__trigger(true);
      });

      expect(getSpans(TEXT).length).toBe(TEXT.length);
    });
  });

  describe('preset behavior', () => {
    it('applies animation styles from single preset', () => {
      render(
        <NodeMotion preset={['fade-in']} trigger="on-load">
          {TEXT}
        </NodeMotion>
      );

      const spans = getSpans(TEXT);

      expect(spans[0].style.animation).toContain('fade-in');
    });

    it('applies multiple presets correctly', () => {
      render(
        <NodeMotion preset={['fade-in', 'slide-up']} trigger="on-load">
          {TEXT}
        </NodeMotion>
      );

      const span = getSpans(TEXT)[0];

      expect(span.style.animation).toContain('fade-in');
      expect(span.style.animation).toContain('slide-up');
    });
  });

  describe('validation and warnings', () => {
    it('warns when children is empty null/undefined', () => {
      render(<NodeMotion>{null}</NodeMotion>);

      expect(consoleWarnSpy).toHaveBeenCalled();

      render(<NodeMotion>{undefined}</NodeMotion>);

      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});

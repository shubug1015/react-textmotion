import { type FC, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import * as useIntersectionObserver from '../../hooks/useIntersectionObserver';

import { NodeMotion } from './NodeMotion';

jest.mock('../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: jest.fn(() => [{ current: null }, false]),
}));

describe('NodeMotion component', () => {
  const TEXT = 'Hello';
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const useIntersectionObserverSpy = jest.spyOn(useIntersectionObserver, 'useIntersectionObserver');

  beforeEach(() => {
    consoleWarnSpy.mockClear();
    useIntersectionObserverSpy.mockClear();
  });

  const MockNodeMotion: FC<{ children: ReactNode; isIntersecting?: boolean }> = ({
    children,
    isIntersecting = false,
  }) => {
    useIntersectionObserverSpy.mockReturnValueOnce([{ current: null }, isIntersecting]);

    return <NodeMotion>{children}</NodeMotion>;
  };

  it('should call useIntersectionObserver with repeat: true by default when trigger is scroll', () => {
    render(<NodeMotion trigger="scroll">{TEXT}</NodeMotion>);

    expect(useIntersectionObserverSpy).toHaveBeenCalledWith({ repeat: true });
  });

  it('should respect the repeat prop when provided', () => {
    render(
      <NodeMotion trigger="scroll" repeat={false}>
        {TEXT}
      </NodeMotion>
    );

    expect(useIntersectionObserverSpy).toHaveBeenCalledWith({ repeat: false });
  });

  it('renders spans immediately when trigger="on-load"', () => {
    render(<NodeMotion trigger="on-load">{TEXT}</NodeMotion>);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(TEXT.length);
  });

  it('renders plain text when not intersecting', () => {
    render(<MockNodeMotion>{TEXT}</MockNodeMotion>);

    const container = screen.getByText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(container.textContent).toBe(TEXT);
    expect(spans.length).toBe(0);
  });

  it('renders spans when intersecting', () => {
    render(<MockNodeMotion isIntersecting>{TEXT}</MockNodeMotion>);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(TEXT.length);
  });

  it('warns when children is empty null/undefined', () => {
    render(<NodeMotion>{null}</NodeMotion>);

    expect(consoleWarnSpy).toHaveBeenCalled();

    render(<NodeMotion>{undefined}</NodeMotion>);

    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});

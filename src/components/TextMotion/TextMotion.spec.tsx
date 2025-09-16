import { FC } from 'react';
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

  const MockTextMotion: FC<{ text: string; isIntersecting?: boolean }> = ({ text, isIntersecting = false }) => {
    useIntersectionObserverSpy.mockReturnValueOnce([{ current: null }, isIntersecting]);

    return <TextMotion text={text} />;
  };

  it('should call useIntersectionObserver with repeat: true by default when trigger is scroll', () => {
    render(<TextMotion text={TEXT} trigger="scroll" />);

    expect(useIntersectionObserverSpy).toHaveBeenCalledWith({ repeat: true });
  });

  it('should call useIntersectionObserver without repeat prop', () => {
    render(<TextMotion text={TEXT} trigger="on-load" />);

    expect(useIntersectionObserverSpy).toHaveBeenCalledWith({ repeat: true });
  });

  it('should respect the repeat prop when provided', () => {
    render(<TextMotion text={TEXT} trigger="scroll" repeat={false} />);

    expect(useIntersectionObserverSpy).toHaveBeenCalledWith({ repeat: false });
  });

  it('renders spans immediately when trigger="on-load"', () => {
    render(<TextMotion text={TEXT} trigger="on-load" />);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(TEXT.length);
  });

  it('renders raw text when not intersecting', () => {
    render(<MockTextMotion text={TEXT} />);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(container.textContent).toBe(TEXT);
    expect(spans.length).toBe(0);
  });

  it('renders spans when intersecting', () => {
    render(<MockTextMotion text={TEXT} isIntersecting />);

    const container = screen.getByLabelText(TEXT);
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

    expect(spans.length).toBe(TEXT.length);
  });

  it('warns when text is empty', () => {
    render(<TextMotion text="" />);

    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});

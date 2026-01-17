import { useEffect } from 'react';
import { act, render, screen } from '@testing-library/react';

import { useIntersectionObserver } from './useIntersectionObserver';

class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  private elements: Element[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = jest.fn((element: Element) => {
    this.elements.push(element);
  });

  unobserve = jest.fn((element: Element) => {
    this.elements = this.elements.filter(el => el !== element);
  });

  disconnect = jest.fn(() => {
    this.elements = [];
  });

  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    act(() => {
      this.callback(
        entries.map(
          entry =>
            ({
              boundingClientRect: {} as DOMRectReadOnly,
              intersectionRatio: 0,
              intersectionRect: {} as DOMRectReadOnly,
              rootBounds: {} as DOMRectReadOnly,
              time: Date.now(),
              ...entry,
            }) as IntersectionObserverEntry
        ),
        this as unknown as IntersectionObserver
      );
    });
  }
}

const mockIntersectionObserver = jest.fn(
  (callback: IntersectionObserverCallback) => new MockIntersectionObserver(callback)
);

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
});

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  const TestComponent = ({
    options,
    onChange,
  }: {
    options?: Parameters<typeof useIntersectionObserver>[0];
    onChange?: (isIntersecting: boolean) => void;
  }) => {
    const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>(options);

    useEffect(() => {
      onChange?.(isIntersecting);
    }, [isIntersecting, onChange]);

    return <div ref={ref} data-testid="target" />;
  };

  it('returns initial isIntersecting as false', () => {
    let value: boolean | undefined;

    render(<TestComponent onChange={v => (value = v)} />);

    expect(value).toBe(false);
  });

  it('sets isIntersecting to true when intersection occurs', () => {
    let value = false;

    render(<TestComponent onChange={v => (value = v)} />);

    const target = screen.getByTestId('target');
    const observer = mockIntersectionObserver.mock.results[0].value as MockIntersectionObserver;

    observer.trigger([{ isIntersecting: true, target }]);

    expect(value).toBe(true);
  });

  it('toggles isIntersecting when repeat is true', () => {
    let value = false;

    render(<TestComponent options={{ repeat: true }} onChange={v => (value = v)} />);

    const target = screen.getByTestId('target');
    const observer = mockIntersectionObserver.mock.results[0].value as MockIntersectionObserver;

    observer.trigger([{ isIntersecting: true, target }]);
    expect(value).toBe(true);

    observer.trigger([{ isIntersecting: false, target }]);
    expect(value).toBe(false);
  });

  it('does not update state when isIntersecting value does not change', () => {
    const onChange = jest.fn();

    render(<TestComponent onChange={onChange} />);

    const target = screen.getByTestId('target');
    const observer = mockIntersectionObserver.mock.results[0].value as MockIntersectionObserver;

    observer.trigger([{ isIntersecting: false, target }]);
    expect(onChange).toHaveBeenCalledTimes(1);

    observer.trigger([{ isIntersecting: true, target }]);
    expect(onChange).toHaveBeenCalledTimes(2);

    observer.trigger([{ isIntersecting: true, target }]);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('unobserves after first intersection when repeat is false', () => {
    let value = false;

    render(<TestComponent options={{ repeat: false }} onChange={v => (value = v)} />);

    const target = screen.getByTestId('target');
    const observer = mockIntersectionObserver.mock.results[0].value as MockIntersectionObserver;

    observer.trigger([{ isIntersecting: true, target }]);

    expect(value).toBe(true);
    expect(observer.unobserve).toHaveBeenCalledWith(target);
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = render(<TestComponent />);

    const observer = mockIntersectionObserver.mock.results[0].value as MockIntersectionObserver;

    unmount();

    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('passes correct options to IntersectionObserver', () => {
    render(<TestComponent options={{ threshold: 0.5, rootMargin: '10px', repeat: true }} />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.5,
      root: null,
      rootMargin: '10px',
    });
  });

  it('does nothing if ref is never attached', () => {
    const NoRefComponent = () => {
      useIntersectionObserver<HTMLDivElement>();
      return null;
    };

    expect(() => render(<NoRefComponent />)).not.toThrow();
  });
});

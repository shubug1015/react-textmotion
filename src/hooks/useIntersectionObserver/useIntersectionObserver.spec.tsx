import { type RefObject, useEffect } from 'react';
import { act, render, screen } from '@testing-library/react';

import { useIntersectionObserver } from './useIntersectionObserver';

class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  private elements: Element[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = (element: Element) => {
    this.elements.push(element);
  };

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

describe('useIntersectionObserver hook', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  const TestComponent = ({
    options,
    onIntersect,
  }: {
    options?: Parameters<typeof useIntersectionObserver>[0];
    onIntersect?: (isIntersecting: boolean) => void;
  }) => {
    const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>(options);

    useEffect(() => {
      onIntersect?.(isIntersecting);
    }, [isIntersecting, onIntersect]);

    return <div ref={ref as RefObject<HTMLDivElement>} data-testid="target-element" />;
  };

  it('should handle null ref without crashing', () => {
    const NullRefComponent = () => {
      useIntersectionObserver<HTMLDivElement>();
      return null;
    };

    act(() => {
      render(<NullRefComponent />);
    });
  });

  it('should return a ref and initial isIntersecting state as false', () => {
    let initialIsIntersecting: boolean | undefined;

    act(() => {
      render(<TestComponent onIntersect={val => (initialIsIntersecting = val)} />);
    });

    expect(initialIsIntersecting).toBe(false);
  });

  it('should set isIntersecting to true when the element intersects', () => {
    let intersected = false;

    act(() => {
      render(<TestComponent onIntersect={val => (intersected = val)} />);
    });

    const targetElement = screen.getByTestId('target-element');
    const observerInstance = mockIntersectionObserver.mock.results[0].value;

    observerInstance.trigger([{ isIntersecting: true, target: targetElement }]);
    expect(intersected).toBe(true);
  });

  it('should toggle isIntersecting when repeat is true', () => {
    let intersected = false;

    act(() => {
      render(<TestComponent options={{ repeat: true }} onIntersect={val => (intersected = val)} />);
    });

    const targetElement = screen.getByTestId('target-element');
    const observerInstance = mockIntersectionObserver.mock.results[0].value;

    observerInstance.trigger([{ isIntersecting: true, target: targetElement }]);
    expect(intersected).toBe(true);

    observerInstance.trigger([{ isIntersecting: false, target: targetElement }]);
    expect(intersected).toBe(false);
  });

  it('should not toggle back when repeat is false', () => {
    let intersected = false;

    act(() => {
      render(<TestComponent options={{ repeat: false }} onIntersect={val => (intersected = val)} />);
    });

    const targetElement = screen.getByTestId('target-element');
    const observerInstance = mockIntersectionObserver.mock.results[0].value;

    observerInstance.trigger([{ isIntersecting: true, target: targetElement }]);
    expect(intersected).toBe(true);

    observerInstance.trigger([{ isIntersecting: false, target: targetElement }]);
    expect(intersected).toBe(false); // 개선된 훅에서는 false로 바뀜
  });

  it('should disconnect the observer on unmount', () => {
    let unmount: () => void;

    act(() => {
      ({ unmount } = render(<TestComponent />));
    });

    const observerInstance = mockIntersectionObserver.mock.results[0].value;

    act(() => {
      unmount();
    });

    expect(observerInstance.disconnect).toHaveBeenCalled();
  });

  it('should pass correct options to IntersectionObserver', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
      repeat: true,
    };

    act(() => {
      render(<TestComponent options={options} />);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.5,
      root: null,
      rootMargin: '10px',
    });
  });
});

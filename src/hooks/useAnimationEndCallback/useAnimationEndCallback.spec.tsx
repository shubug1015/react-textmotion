import { act, renderHook } from '@testing-library/react';

import { useAnimationEndCallback } from './useAnimationEndCallback';

describe('useAnimationEndCallback', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useAnimationEndCallback(() => {}));
    expect(typeof result.current).toBe('function');
  });

  it('should call the callback only once', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useAnimationEndCallback(callback));

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not throw if the callback is not provided', () => {
    const { result } = renderHook(() => useAnimationEndCallback());

    act(() => {
      expect(() => result.current()).not.toThrow();
    });
  });

  it('should handle callback changes', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { result, rerender } = renderHook(({ cb }) => useAnimationEndCallback(cb), {
      initialProps: { cb: callback1 },
    });

    rerender({ cb: callback2 });

    act(() => {
      result.current();
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);

    act(() => {
      result.current();
    });

    expect(callback2).toHaveBeenCalledTimes(1);
  });
});

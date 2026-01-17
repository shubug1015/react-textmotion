import { renderHook } from '@testing-library/react';

import type { Preset, TextMotionProps } from '../../types';
import { splitReactNode } from '../../utils/splitReactNode';
import { useAnimateChildren } from '../useAnimateChildren';
import { useIntersectionObserver } from '../useIntersectionObserver';
import { useResolveMotion } from '../useResolveMotion';

import { useTextMotionAnimation } from './useTextMotionAnimation';

jest.mock('../useIntersectionObserver');
jest.mock('../useResolveMotion');
jest.mock('../useAnimateChildren');
jest.mock('../../utils/splitReactNode');

describe('useTextMotionAnimation', () => {
  const mockUseIntersectionObserver = useIntersectionObserver as jest.Mock;
  const mockUseResolvedMotion = useResolveMotion as jest.Mock;
  const mockUseAnimatedChildren = useAnimateChildren as jest.Mock;
  const mockSplitReactNode = splitReactNode as jest.Mock;

  const defaultProps: TextMotionProps = {
    children: 'Hello',
  };

  beforeEach(() => {
    mockUseIntersectionObserver.mockReturnValue([null, true]);
    mockUseResolvedMotion.mockReturnValue({});
    mockUseAnimatedChildren.mockReturnValue([]);
    mockSplitReactNode.mockReturnValue({ nodes: ['H', 'e', 'l', 'l', 'o'], text: 'Hello' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call splitReactNode with children and split type', () => {
    renderHook(() => useTextMotionAnimation({ ...defaultProps, split: 'word' }));
    expect(mockSplitReactNode).toHaveBeenCalledWith('Hello', 'word');
  });

  it('should determine shouldAnimate based on trigger and intersection', () => {
    // trigger="on-load"
    const { result: result1 } = renderHook(() => useTextMotionAnimation({ ...defaultProps, trigger: 'on-load' }));
    expect(result1.current.shouldAnimate).toBe(true);

    // trigger="scroll" and is intersecting
    mockUseIntersectionObserver.mockReturnValue([null, true]);
    const { result: result2 } = renderHook(() => useTextMotionAnimation({ ...defaultProps, trigger: 'scroll' }));
    expect(result2.current.shouldAnimate).toBe(true);

    // trigger="scroll" and is not intersecting
    mockUseIntersectionObserver.mockReturnValue([null, false]);
    const { result: result3 } = renderHook(() => useTextMotionAnimation({ ...defaultProps, trigger: 'scroll' }));
    expect(result3.current.shouldAnimate).toBe(false);
  });

  it('should call useResolveMotion with motion prop', () => {
    const motion = { fade: { variant: 'in' as const, duration: 1, delay: 1 } };
    const props = { ...defaultProps, motion };
    renderHook(() => useTextMotionAnimation(props));
    expect(mockUseResolvedMotion).toHaveBeenCalledWith({ motion, preset: undefined });
  });

  it('should call useResolveMotion with preset prop', () => {
    const preset: Preset[] = ['slide-up'];
    const props = { ...defaultProps, preset };
    renderHook(() => useTextMotionAnimation(props));
    expect(mockUseResolvedMotion).toHaveBeenCalledWith({ motion: undefined, preset });
  });

  it('should call useAnimateChildren with correct props when animating', () => {
    const props = { ...defaultProps, initialDelay: 1, animationOrder: 'last-to-first' as const };
    renderHook(() => useTextMotionAnimation(props));

    expect(mockUseAnimatedChildren).toHaveBeenCalledWith({
      nodes: ['H', 'e', 'l', 'l', 'o'],
      initialDelay: 1,
      animationOrder: 'last-to-first',
      motion: {},
      onAnimationEnd: undefined,
    });
  });

  it('should call useAnimateChildren with original children when not animating', () => {
    mockUseIntersectionObserver.mockReturnValue([null, false]);
    const props = { ...defaultProps, trigger: 'scroll' as const };
    renderHook(() => useTextMotionAnimation(props));

    expect(mockUseAnimatedChildren).toHaveBeenCalledWith(
      expect.objectContaining({
        nodes: [defaultProps.children],
      })
    );
  });

  it('should return correct values', () => {
    mockUseIntersectionObserver.mockReturnValue(['ref', true]);
    mockSplitReactNode.mockReturnValue({ nodes: ['Test'], text: 'Test' });
    mockUseAnimatedChildren.mockReturnValue(['Animated Test']);

    const { result } = renderHook(() => useTextMotionAnimation(defaultProps));

    expect(result.current.shouldAnimate).toBe(true);
    expect(result.current.targetRef).toBe('ref');
    expect(result.current.animatedChildren).toEqual(['Animated Test']);
    expect(result.current.text).toBe('Test');
  });
});

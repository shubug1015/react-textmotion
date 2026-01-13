import { renderHook } from '@testing-library/react';

import type { Preset, TextMotionProps } from '../../types';
import { splitNodeAndExtractText } from '../../utils/splitNodeAndExtractText';
import { useAnimatedChildren } from '../useAnimatedChildren';
import { useIntersectionObserver } from '../useIntersectionObserver';
import { useResolvedMotion } from '../useResolvedMotion';

import { useTextMotionAnimation } from './useTextMotionAnimation';

jest.mock('../useIntersectionObserver');
jest.mock('../useResolvedMotion');
jest.mock('../useAnimatedChildren');
jest.mock('../../utils/splitNodeAndExtractText');

describe('useTextMotionAnimation', () => {
  const mockUseIntersectionObserver = useIntersectionObserver as jest.Mock;
  const mockUseResolvedMotion = useResolvedMotion as jest.Mock;
  const mockUseAnimatedChildren = useAnimatedChildren as jest.Mock;
  const mockSplitNodeAndExtractText = splitNodeAndExtractText as jest.Mock;

  const defaultProps: TextMotionProps = {
    children: 'Hello',
  };

  beforeEach(() => {
    mockUseIntersectionObserver.mockReturnValue([null, true]);
    mockUseResolvedMotion.mockReturnValue({});
    mockUseAnimatedChildren.mockReturnValue([]);
    mockSplitNodeAndExtractText.mockReturnValue({ splittedNode: ['H', 'e', 'l', 'l', 'o'], text: 'Hello' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call splitNodeAndExtractText with children and split type', () => {
    renderHook(() => useTextMotionAnimation({ ...defaultProps, split: 'word' }));
    expect(mockSplitNodeAndExtractText).toHaveBeenCalledWith('Hello', 'word');
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

  it('should call useResolvedMotion with motion prop', () => {
    const motion = { fade: { variant: 'in' as const, duration: 1, delay: 1 } };
    const props = { ...defaultProps, motion };
    renderHook(() => useTextMotionAnimation(props));
    expect(mockUseResolvedMotion).toHaveBeenCalledWith({ motion, preset: undefined });
  });

  it('should call useResolvedMotion with preset prop', () => {
    const preset: Preset[] = ['slide-up'];
    const props = { ...defaultProps, preset };
    renderHook(() => useTextMotionAnimation(props));
    expect(mockUseResolvedMotion).toHaveBeenCalledWith({ motion: undefined, preset });
  });

  it('should call useAnimatedChildren with correct props when animating', () => {
    const props = { ...defaultProps, initialDelay: 1, animationOrder: 'last-to-first' as const };
    renderHook(() => useTextMotionAnimation(props));

    expect(mockUseAnimatedChildren).toHaveBeenCalledWith({
      splittedNode: ['H', 'e', 'l', 'l', 'o'],
      initialDelay: 1,
      animationOrder: 'last-to-first',
      resolvedMotion: {},
      onAnimationEnd: undefined,
    });
  });

  it('should call useAnimatedChildren with original children when not animating', () => {
    mockUseIntersectionObserver.mockReturnValue([null, false]);
    const props = { ...defaultProps, trigger: 'scroll' as const };
    renderHook(() => useTextMotionAnimation(props));

    expect(mockUseAnimatedChildren).toHaveBeenCalledWith(
      expect.objectContaining({
        splittedNode: [defaultProps.children],
      })
    );
  });

  it('should return correct values', () => {
    mockUseIntersectionObserver.mockReturnValue(['ref', true]);
    mockSplitNodeAndExtractText.mockReturnValue({ splittedNode: ['Test'], text: 'Test' });
    mockUseAnimatedChildren.mockReturnValue(['Animated Test']);

    const { result } = renderHook(() => useTextMotionAnimation(defaultProps));

    expect(result.current.shouldAnimate).toBe(true);
    expect(result.current.targetRef).toBe('ref');
    expect(result.current.animatedChildren).toEqual(['Animated Test']);
    expect(result.current.text).toBe('Test');
  });
});

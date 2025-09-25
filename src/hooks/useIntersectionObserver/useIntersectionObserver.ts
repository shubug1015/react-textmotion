import { type RefObject, useEffect, useRef, useState } from 'react';

type UseIntersectionObserverProps = IntersectionObserverInit & {
  repeat?: boolean;
};

/**
 * @description
 * `useIntersectionObserver` is a custom hook that provides a way to observe changes in the intersection
 * of a target element with an ancestor element or with a top-level document's viewport.
 * It returns a ref to be attached to the target element and a boolean indicating whether the element is intersecting.
 *
 * @template T - The type of the HTML element that the ref will be attached to.
 * @param {UseIntersectionObserverProps} [options] - Options for the Intersection Observer.
 * @param {number} [options.threshold=0] - A single number or an array of numbers indicating at what percentage of the target's visibility the observer's callback should be executed.
 * @param {Element | Document | null} [options.root=null] - The element that is used as the viewport for checking intersection. Defaults to the browser viewport if not specified or if null.
 * @param {string} [options.rootMargin='0%'] - Margin around the root. Can have values similar to the CSS margin property, e.g. "10px 20px 30px 40px" (top, right, bottom, left).
 * @param {boolean} [options.repeat=true] - If true, the observer will keep observing the element. If false, the observer will unobserve after the first intersection. Defaults to true.
 *
 * @returns {[RefObject<T | null>, boolean]} A tuple containing:
 * - `ref`: A RefObject to be attached to the DOM element you want to observe.
 * - `isIntersecting`: A boolean indicating whether the observed element is currently intersecting with its root.
 */
export const useIntersectionObserver = <T extends Element>(
  options: UseIntersectionObserverProps = {}
): [RefObject<T | null>, boolean] => {
  const { threshold = 0, root = null, rootMargin = '0%', repeat = true } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && !repeat) {
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, repeat]);

  return [ref, isIntersecting];
};

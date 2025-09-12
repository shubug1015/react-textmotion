import { RefObject, useEffect, useRef, useState } from 'react';

type IntersectionObserverOptions = {
  triggerOnce?: boolean;
} & IntersectionObserverInit;

export const useIntersectionObserver = <T extends Element>(
  options: IntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] => {
  const { threshold = 0, root = null, rootMargin = '0%', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else {
          if (!triggerOnce) {
            setIsIntersecting(false);
          }
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, threshold, root, rootMargin, triggerOnce]);

  return [ref, isIntersecting];
};

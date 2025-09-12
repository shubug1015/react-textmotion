import { RefObject, useEffect, useState } from 'react';

type IntersectionObserverOptions = {
  triggerOnce?: boolean;
} & IntersectionObserverInit;

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverOptions = {}
): boolean => {
  const { threshold = 0, root = null, rootMargin = '0%', triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (element === undefined || element === null) {
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

  return isIntersecting;
};

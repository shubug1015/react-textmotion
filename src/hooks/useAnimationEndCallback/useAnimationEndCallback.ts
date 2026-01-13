import { useCallback, useRef } from 'react';

/**
 * @description
 * `useAnimationEndCallback` is a custom hook that calls a callback function when the animation ends.
 * It returns a function that should be passed to the `onAnimationEnd` prop of the animated component.
 *
 * @param {() => void} callback - The callback function to call when the animation ends.
 * @returns {() => void} A function that should be passed to the `onAnimationEnd` prop of the animated component.
 */
export const useAnimationEndCallback = (callback?: () => void) => {
  const calledRef = useRef(false);

  const handleAnimationEnd = useCallback(() => {
    if (!calledRef.current && callback) {
      calledRef.current = true;
      callback();
    }
  }, [callback]);

  return handleAnimationEnd;
};

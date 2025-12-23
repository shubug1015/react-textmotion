import { keyframes } from '@vanilla-extract/css';

export const fadeIn = keyframes({
  from: { opacity: 'var(--fade-from, 0)' },
  to: { opacity: 'var(--fade-to, 1)' },
});

export const fadeOut = keyframes({
  from: { opacity: 'var(--fade-from, 1)' },
  to: { opacity: 'var(--fade-to, 0)' },
});

export const slideUp = keyframes({
  from: { transform: 'translateY(var(--slide-distance, 0.4rem))' },
  to: { transform: 'translateY(0)' },
});

export const slideDown = keyframes({
  from: { transform: 'translateY(var(--slide-distance, -0.4rem))' },
  to: { transform: 'translateY(0)' },
});

export const slideRight = keyframes({
  from: { transform: 'translateX(var(--slide-distance, -0.4rem))' },
  to: { transform: 'translateX(0)' },
});

export const slideLeft = keyframes({
  from: { transform: 'translateX(var(--slide-distance, 0.4rem))' },
  to: { transform: 'translateX(0)' },
});

export const scaleIn = keyframes({
  from: { transform: 'scale(var(--scale-from, 0.9))' },
  to: { transform: 'scale(var(--scale-to, 1))' },
});

export const scaleOut = keyframes({
  from: { transform: 'scale(var(--scale-from, 1))' },
  to: { transform: 'scale(var(--scale-to, 0.9))' },
});

export const rotateClockwise = keyframes({
  from: { transform: 'var(--rotate-from, rotate(0deg))' },
  to: { transform: 'var(--rotate-to, rotate(360deg))' },
});

export const rotateCounterclockwise = keyframes({
  from: { transform: 'var(--rotate-from, rotate(360deg))' },
  to: { transform: 'var(--rotate-to, rotate(0deg))' },
});

export const bounceIn = keyframes({
  '0%': { transform: 'scale(var(--bounce-from, 0.5))' },
  '50%': { transform: 'scale(var(--bounce-mid, 1.05))' },
  '100%': { transform: 'scale(var(--bounce-to, 1))' },
});

export const bounceOut = keyframes({
  '0%': { transform: 'scale(var(--bounce-from, 1))' },
  '50%': { transform: 'scale(var(--bounce-mid, 1.05))' },
  '100%': { transform: 'scale(var(--bounce-to, 0.5))' },
});

export const elasticIn = keyframes({
  '0%': { transform: 'scaleX(var(--elastic-from, 0))' },
  '60%': { transform: 'scaleX(var(--elastic-mid1, 1.2))' },
  '80%': { transform: 'scaleX(var(--elastic-mid2, 0.9))' },
  '100%': { transform: 'scaleX(var(--elastic-to, 1))' },
});

export const elasticOut = keyframes({
  '0%': { transform: 'scaleX(var(--elastic-from, 1))' },
  '20%': { transform: 'scaleX(var(--elastic-mid1, 0.9))' },
  '40%': { transform: 'scaleX(var(--elastic-mid2, 1.2))' },
  '100%': { transform: 'scaleX(var(--elastic-to, 0))' },
});

export const flipIn = keyframes({
  from: { transform: 'perspective(40rem) rotateY(var(--flip-from, 90deg))' },
  to: { transform: 'perspective(40rem) rotateY(var(--flip-to, 0deg))' },
});

export const flipOut = keyframes({
  from: { transform: 'perspective(40rem) rotateY(var(--flip-from, 0deg))' },
  to: { transform: 'perspective(40rem) rotateY(var(--flip-to, 90deg))' },
});

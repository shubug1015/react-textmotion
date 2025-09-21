import type { Split } from '../../types';

/**
 * @description
 * `splitText` is a utility function that splits a string into an array of substrings based on the specified split type.
 *
 * @param {string} text - The text to be split.
 * @param {Split} split - The split type (`character`, `word`, or `line`).
 *
 * @returns {string[]} An array of substrings.
 */
export const splitText = (text: string, split: Split): string[] => {
  switch (split) {
    case 'word':
      return text.split(/(\s+)/).filter(Boolean);
    case 'line':
      return text.split(/(\n)/).filter(Boolean);
    case 'character':
    default:
      return text.split('');
  }
};

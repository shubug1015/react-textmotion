import type { AnimationOrder } from '../../types';

/**
 * @description
 * `calculateSequenceIndex` is a pure function that calculates the sequence index of a node in a sequence.
 * It returns the sequence index of the node based on the animation order.
 *
 * @param {number} currentIndex - The current index of the node.
 * @param {number} totalNodes - The total number of nodes in the sequence.
 * @param {AnimationOrder} animationOrder - The animation order of the sequence.
 * @returns {number} The sequence index of the node.
 */
export const calculateSequenceIndex = (
  currentIndex: number,
  totalNodes: number,
  animationOrder: AnimationOrder
): number => {
  return animationOrder === 'first-to-last' ? currentIndex : totalNodes - currentIndex - 1;
};

/**
 * @description
 * `isLastNode` is a pure function that checks if a node is the last node in a sequence.
 * It returns `true` if the node is the last node, otherwise `false`.
 *
 * @param {number} sequenceIndex - The sequence index of the node.
 * @param {number} totalNodes - The total number of nodes in the sequence.
 * @returns {boolean} `true` if the node is the last node, otherwise `false`.
 */
export const isLastNode = (sequenceIndex: number, totalNodes: number): boolean => {
  return sequenceIndex === totalNodes - 1;
};

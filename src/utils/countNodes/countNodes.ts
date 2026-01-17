import { Children, type ReactNode } from 'react';

import { isElementWithChildren, isNonRenderableNode, isTextNode } from '../typeGuards';

/**
 * @description
 * `countNodes` is a recursive pure function that counts the number of text nodes in a React node tree.
 * It returns the total number of text nodes in the tree, which are the nodes that will be animated.
 *
 * @param {ReactNode} node - The React node to count.
 *
 * @returns {number} The total number of animated (text) nodes in the tree.
 */
export const countNodes = (node: ReactNode): number => {
  if (isNonRenderableNode(node)) {
    return 0;
  }

  if (isTextNode(node)) {
    return 1;
  }

  if (isElementWithChildren(node)) {
    return countNodes(node.props.children);
  }

  let count = 0;

  Children.forEach(node, child => {
    count += countNodes(child);
  });

  return count;
};

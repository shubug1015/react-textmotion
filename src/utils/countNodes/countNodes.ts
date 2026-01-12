import { Children, type ReactNode } from 'react';

import { isElementWithChildren, isNullishNode, isTextNode } from '../typeGuards';

/**
 * @description
 * `countNodes` is a recursive pure function that counts the number of text nodes in a React node tree.
 * It returns the total number of text nodes in the tree, which are the nodes that will be animated.
 *
 * @param {ReactNode[]} nodes - The array of React nodes to count.
 * @returns {number} The total number of animated (text) nodes in the tree.
 */
export const countNodes = (nodes: ReactNode[]): number => {
  let count = 0;

  Children.forEach(nodes, node => {
    if (isNullishNode(node)) {
      return;
    }

    if (isTextNode(node)) {
      count += 1;
    } else if (isElementWithChildren(node)) {
      count += countNodes(Children.toArray(node.props.children));
    }
  });

  return count;
};

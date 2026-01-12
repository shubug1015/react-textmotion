import { Children, type ReactNode } from 'react';

import { isElementWithChildren, isNullishNode } from '../typeGuards';

/**
 * @description
 * `countNodes` is a recursive pure function that counts the number of nodes in a React node tree.
 * It returns the total number of nodes in the tree.
 *
 * @param {ReactNode[]} nodes - The array of React nodes to count.
 * @returns {number} The total number of nodes in the tree.
 */
export const countNodes = (nodes: ReactNode[]): number => {
  let count = 0;

  Children.forEach(nodes, node => {
    if (isNullishNode(node)) {
      return;
    }

    count += 1;

    if (isElementWithChildren(node)) {
      count += countNodes(Children.toArray(node.props.children));
    }
  });

  return count;
};

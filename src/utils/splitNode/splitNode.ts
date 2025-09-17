import { cloneElement, isValidElement, ReactNode } from 'react';

import { SplitType } from '../../types';
import { splitText } from '../splitText';

/**
 * @description
 * `splitNode` is a recursive pure function that traverses a React node and its children,
 * splitting nodes into substrings based on the specified split type.
 *
 * @param {ReactNode} node - The React node to split.
 * @param {SplitType} split - The split type for text animations (`character` or `word`).
 *
 * @returns {ReactNode[]} An array of substrings.
 */
export const splitNode = (node: ReactNode, split: SplitType): ReactNode[] => {
  if (node == null || typeof node === 'boolean') return [];

  if (typeof node === 'string' || typeof node === 'number') {
    return splitText(String(node), split);
  }

  if (Array.isArray(node)) {
    return node.flatMap(child => splitNode(child, split));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const childrenNodes = splitNode(node.props.children, split);

    return [cloneElement(node, { children: childrenNodes })];
  }

  return [node];
};

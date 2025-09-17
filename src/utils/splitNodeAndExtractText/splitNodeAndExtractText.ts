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
export const splitNodeAndExtractText = (
  node: ReactNode,
  split: SplitType
): { splittedNodes: ReactNode[]; text: string } => {
  if (node == null || typeof node === 'boolean') {
    return { splittedNodes: [], text: '' };
  }

  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node);
    return {
      splittedNodes: splitText(text, split),
      text,
    };
  }

  if (Array.isArray(node)) {
    return node.reduce<{ splittedNodes: ReactNode[]; text: string }>(
      (acc, child) => {
        const { splittedNodes, text } = splitNodeAndExtractText(child, split);

        acc.splittedNodes.push(...splittedNodes);
        acc.text += text;

        return acc;
      },
      { splittedNodes: [], text: '' }
    );
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const { splittedNodes, text } = splitNodeAndExtractText(node.props.children, split);
    return {
      splittedNodes: [cloneElement(node, { children: splittedNodes })],
      text,
    };
  }

  return { splittedNodes: [node], text: '' };
};

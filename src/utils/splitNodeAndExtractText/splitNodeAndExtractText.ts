import { cloneElement, isValidElement, ReactNode } from 'react';

import { SplitType } from '../../types';
import { splitText } from '../splitText';

/**
 * @description
 * `splitNodeAndExtractText` is a recursive pure function that traverses a React node and its children,
 * splitting nodes into substrings based on the specified split type.
 * It returns an object containing the array of substrings and the extracted text.
 *
 * @param {ReactNode} node - The React node to split.
 * @param {SplitType} split - The split type for text animations (`character` or `word`).
 *
 * @returns {{ splittedNode: ReactNode[]; text: string }} An object containing the array of substrings and the extracted text.
 */
export const splitNodeAndExtractText = (
  node: ReactNode,
  split: SplitType
): { splittedNode: ReactNode[]; text: string } => {
  if (node == null || typeof node === 'boolean') {
    return { splittedNode: [], text: '' };
  }

  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node);
    return {
      splittedNode: splitText(text, split),
      text,
    };
  }

  if (Array.isArray(node)) {
    return node.reduce<{ splittedNode: ReactNode[]; text: string }>(
      (acc, child) => {
        const { splittedNode, text } = splitNodeAndExtractText(child, split);

        acc.splittedNode.push(...splittedNode);
        acc.text += text;

        return acc;
      },
      { splittedNode: [], text: '' }
    );
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const { splittedNode, text } = splitNodeAndExtractText(node.props.children, split);

    return {
      splittedNode: [cloneElement(node, { children: splittedNode })],
      text,
    };
  }

  return { splittedNode: [node], text: '' };
};

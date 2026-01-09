import { cloneElement, type ReactNode } from 'react';

import type { Split } from '../../types';
import { splitText } from '../splitText';
import { isElementWithChildren, isNullishNode, isTextNode } from '../typeGuards/typeGuards';

/**
 * @description
 * `splitNodeAndExtractText` is a recursive pure function that traverses a React node and its children,
 * splitting nodes into substrings based on the specified split type.
 * It returns an object containing the array of substrings and the extracted text.
 *
 * @param {ReactNode} node - The React node to split.
 * @param {Split} split - The split type for text animations (`character` or `word`).
 *
 * @returns {{ splittedNode: ReactNode[]; text: string }} An object containing the array of substrings and the extracted text.
 */
export const splitNodeAndExtractText = (node: ReactNode, split: Split): { splittedNode: ReactNode[]; text: string } => {
  if (isNullishNode(node)) {
    return { splittedNode: [], text: '' };
  }

  if (isTextNode(node)) {
    const text = String(node);
    return {
      splittedNode: splitText(text, split),
      text,
    };
  }

  if (Array.isArray(node)) {
    return node.reduce<{ splittedNode: ReactNode[]; text: string }>(
      (accumulator, child) => {
        const { splittedNode, text } = splitNodeAndExtractText(child, split);

        return {
          splittedNode: [...accumulator.splittedNode, ...splittedNode],
          text: accumulator.text + text,
        };
      },
      { splittedNode: [], text: '' }
    );
  }

  if (isElementWithChildren(node)) {
    const { splittedNode, text } = splitNodeAndExtractText(node.props.children, split);

    return {
      splittedNode: [cloneElement(node, { children: splittedNode })],
      text,
    };
  }

  return { splittedNode: [node], text: '' };
};

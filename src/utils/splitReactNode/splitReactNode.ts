import { cloneElement, type ReactNode } from 'react';

import type { Split } from '../../types';
import { splitText } from '../splitText';
import { isElementWithChildren, isNonRenderableNode, isTextNode } from '../typeGuards/typeGuards';

type SplitResult = {
  nodes: ReactNode[];
  text: string;
};

/**
 * @description
 * `splitNodeAndExtractText` is a recursive pure function that traverses a React node and its children,
 * splitting nodes into substrings based on the specified split type.
 * It returns an object containing the array of substrings and the extracted text.
 *
 * @param {ReactNode} node - The React node to split.
 * @param {Split} split - The split type for text animations (`character` or `word`).
 *
 * @returns {{ nodes: ReactNode[]; text: string }} An object containing the array of substrings and the extracted text.
 */
export const splitReactNode = (node: ReactNode, split: Split): SplitResult => {
  if (isNonRenderableNode(node)) {
    return { nodes: [], text: '' };
  }

  if (isTextNode(node)) {
    const text = String(node);
    return {
      nodes: splitText(text, split),
      text,
    };
  }

  if (Array.isArray(node)) {
    return node.map(child => splitReactNode(child, split)).reduce(mergeResults, { nodes: [], text: '' });
  }

  if (isElementWithChildren(node)) {
    const result = splitReactNode(node.props.children, split);

    return {
      nodes: [
        cloneElement(node, {
          children: result.nodes,
        }),
      ],
      text: result.text,
    };
  }

  return {
    nodes: [node],
    text: '',
  };
};

const mergeResults = (a: SplitResult, b: SplitResult): SplitResult => ({
  nodes: [...a.nodes, ...b.nodes],
  text: a.text + b.text,
});

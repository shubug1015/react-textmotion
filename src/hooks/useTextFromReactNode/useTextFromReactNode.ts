import { isValidElement, ReactNode, useMemo } from 'react';

/**
 * @description
 * `getTextFromReactNode` is a utility function that recursively extracts the text content from a React node.
 * It handles strings, numbers, arrays of nodes, and React elements.
 *
 * @param {ReactNode} node - The React node to extract text from.
 *
 * @returns {string} The extracted text content.
 */
const getTextFromReactNode = (node: ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }

  if (typeof node === 'number') {
    return node.toString();
  }

  if (Array.isArray(node)) {
    return node.map(getTextFromReactNode).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextFromReactNode(node.props.children);
  }

  return '';
};

/**
 * @description
 * `useTextFromReactNode` is a custom hook that extracts the text content from a React node and memoizes the result.
 * This is useful for accessibility purposes, such as providing an `aria-label` for an animated component.
 *
 * @param {ReactNode} children - The React node to extract text from.
 *
 * @returns {string} The extracted and memoized text content.
 */
export const useTextFromReactNode = (children: ReactNode): string => {
  const textFromReactNode = useMemo(() => getTextFromReactNode(children), [children]);

  return textFromReactNode;
};

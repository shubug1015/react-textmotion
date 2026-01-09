import { isValidElement, type ReactElement, type ReactNode } from 'react';

/**
 * @description
 * Type guard function that checks if a React node is a text node (string or number).
 *
 * @param {ReactNode} node - The React node to check.
 * @returns {boolean} True if the node is a string or number, false otherwise.
 */
export const isTextNode = (node: ReactNode): node is string | number => {
  return typeof node === 'string' || typeof node === 'number';
};

/**
 * @description
 * Type guard function that checks if a React node is nullish (null, undefined, or boolean).
 *
 * @param {ReactNode} node - The React node to check.
 * @returns {boolean} True if the node is null, undefined, or boolean, false otherwise.
 */
export const isNullishNode = (node: ReactNode): node is null | undefined | boolean => {
  return node == null || typeof node === 'boolean';
};

/**
 * @description
 * Type guard function that checks if a React node is a valid React element with children.
 *
 * @param {ReactNode} node - The React node to check.
 * @returns {boolean} True if the node is a valid React element with children, false otherwise.
 */
export const isElementWithChildren = (node: ReactNode): node is ReactElement<{ children?: ReactNode }> => {
  if (!isValidElement(node)) {
    return false;
  }

  const props = node.props as Record<string, unknown> | null | undefined;
  return props !== null && props !== undefined && 'children' in props;
};

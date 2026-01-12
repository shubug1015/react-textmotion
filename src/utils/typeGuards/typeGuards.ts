import { isValidElement, type ReactElement, type ReactNode } from 'react';

/**
 * @description
 * Type guard function that checks if a React node is a text node (string or number).
 * It returns `true` if the node is a string or number, otherwise `false`.
 *
 * @param {ReactNode} node - The React node to check.
 * @returns {boolean} `true` if the node is a string or number, otherwise `false`.
 */
export const isTextNode = (node: ReactNode): node is string | number => {
  return typeof node === 'string' || typeof node === 'number';
};

/**
 * @description
 * Type guard function that checks if a React node is nullish (null, undefined, or boolean).
 * It returns `true` if the node is null, undefined, or boolean, otherwise `false`.
 *
 * @param {ReactNode} node - The React node to check.
 * @returns {boolean} `true` if the node is null, undefined, or boolean, otherwise `false`.
 */
export const isNullishNode = (node: ReactNode): node is null | undefined | boolean => {
  return node == null || typeof node === 'boolean';
};

/**
 * @description
 * Type guard function that checks if a React node is a valid React element with children.
 * It returns `true` if the node is a valid React element with children, otherwise `false`.
 *
 * @param {ReactNode} node - The React node to check.
 * @returns {boolean} `true` if the node is a valid React element with children, otherwise `false`.
 */
export const isElementWithChildren = (node: ReactNode): node is ReactElement<{ children?: ReactNode }> => {
  if (!isValidElement(node)) {
    return false;
  }

  const props = node.props as Record<string, unknown> | null | undefined;
  return props !== null && props !== undefined && 'children' in props;
};

import { isValidElement, ReactNode, useMemo } from 'react';

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

export const useGetTextFromReactNode = (children: ReactNode): string => {
  const textFromReactNode = useMemo(() => getTextFromReactNode(children), [children]);

  return textFromReactNode;
};

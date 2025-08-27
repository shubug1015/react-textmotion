import { isValidElement, ReactNode } from 'react';

export const getTextFromReactNode = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }

  if (typeof children === 'number') {
    return children.toString();
  }

  if (Array.isArray(children)) {
    return children.map(getTextFromReactNode).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getTextFromReactNode(children.props.children);
  }

  return '';
};

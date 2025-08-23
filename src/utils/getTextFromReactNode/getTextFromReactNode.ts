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

// const getTextFromChildren = (children: ReactNode): string => {
//   if (typeof children === 'string') return children;
//   if (Array.isArray(children)) return children.map(getTextFromChildren).join('');
//   if (isValidElement<{ children?: ReactNode }>(children)) {
//     return getTextFromChildren(children.props.children);
//   }
//   return '';
// };

import { isValidElement, ReactNode } from 'react';

export const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }

  if (typeof children === 'number') {
    return children.toString();
  }

  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }

  if (isValidElement(children)) {
    return extractText((children.props as { children?: ReactNode }).children);
  }

  return '';
};

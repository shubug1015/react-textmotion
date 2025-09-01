import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { Children, cloneElement, ElementType, FC, isValidElement, ReactNode, useMemo, useRef } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { createAnimatedSpan, getTextFromReactNode, mergeMotion, splitText } from '../../utils';

type NodeMotionProps = {
  as?: ElementType;
  children: ReactNode;
  split?: SplitType;
  motion?: MotionConfig;
};

const applyAnimationToNode = (
  node: ReactNode,
  motion: MotionConfig,
  split: SplitType,
  sequenceIndexRef: { current: number }
): ReactNode => {
  if (typeof node === 'string') {
    const textSegments = splitText(node, split);

    return textSegments.map(segment => createAnimatedSpan(segment, sequenceIndexRef.current++, motion));
  }

  if (typeof node === 'number') {
    const textSegments = splitText(node.toString(), split);

    return textSegments.map(segment => createAnimatedSpan(segment, sequenceIndexRef.current++, motion));
  }

  if (Array.isArray(node)) {
    return Children.map(node, child => applyAnimationToNode(child, motion, split, sequenceIndexRef));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const originalElement = node;
    const animatedChildNodes = applyAnimationToNode(originalElement.props.children, motion, split, sequenceIndexRef);
    const normalizedChildren = Array.isArray(animatedChildNodes)
      ? (animatedChildNodes as ReactNode[])
      : [animatedChildNodes];

    return cloneElement(originalElement, { key: sequenceIndexRef.current++ }, ...normalizedChildren);
  }

  return node;
};

export const NodeMotion: FC<NodeMotionProps> = ({ as: Tag = 'span', children, split = 'character', motion }) => {
  const accessibleText = useMemo(() => getTextFromReactNode(children), [children]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  const sequenceIndexRef = useRef(0);

  const animatedChildren = useMemo(() => {
    sequenceIndexRef.current = 0;

    const collectedChildren: ReactNode[] = [];

    Children.forEach(children, child => {
      const childResult = applyAnimationToNode(child, mergedMotion, split, sequenceIndexRef);

      if (Array.isArray(childResult)) {
        collectedChildren.push(...(childResult as ReactNode[]));
      } else {
        collectedChildren.push(childResult);
      }
    });

    return collectedChildren;
  }, [children, mergedMotion, split]);

  return (
    <Tag className="motion" aria-label={accessibleText}>
      {Children.toArray(animatedChildren)}
    </Tag>
  );
};

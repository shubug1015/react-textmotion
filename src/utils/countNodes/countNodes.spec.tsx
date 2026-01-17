import type { ReactNode } from 'react';

import { countNodes } from './countNodes';

describe('countNodes', () => {
  describe('non-renderable nodes', () => {
    it('returns 0 for null, undefined, and boolean values', () => {
      expect(countNodes(null)).toBe(0);
      expect(countNodes(undefined)).toBe(0);
      expect(countNodes(false)).toBe(0);
    });

    it('returns 0 for an empty fragment', () => {
      expect(countNodes(<></>)).toBe(0);
    });
  });

  describe('text nodes', () => {
    it('counts a single text node as 1', () => {
      expect(countNodes('Hello')).toBe(1);
      expect(countNodes(123)).toBe(1);
    });

    it('counts multiple text nodes separated by JSX expressions', () => {
      expect(
        countNodes(
          <>
            {'Hello'} {'World'}
          </>
        )
      ).toBe(3);
    });

    it('counts mixed text and element siblings correctly', () => {
      expect(
        countNodes(
          <>
            Start<span>Middle</span>End
          </>
        )
      ).toBe(3);
    });
  });

  describe('element nodes', () => {
    it('counts text inside a single element', () => {
      expect(countNodes(<span>Hello</span>)).toBe(1);
    });

    it('counts multiple sibling elements', () => {
      expect(
        countNodes(
          <>
            <span>Hello</span>
            <span>World</span>
          </>
        )
      ).toBe(2);
    });

    it('counts nested elements recursively', () => {
      expect(
        countNodes(
          <div>
            <span>Hello</span>
            <p>
              <span>Deep</span>
              <span>Nested</span>
            </p>
          </div>
        )
      ).toBe(3);
    });
  });

  describe('arrays and composite children', () => {
    it('counts nodes inside an array of ReactNode', () => {
      expect(
        countNodes([
          'A',
          'B',
          <div key="c">
            <span>C</span>
          </div>,
          'D',
        ])
      ).toBe(4);
    });

    it('ignores nullish values inside children arrays', () => {
      expect(
        countNodes(
          <>
            {'Hello'}
            {null}
            {undefined}
            <span>World</span>
          </>
        )
      ).toBe(2);
    });
  });

  describe('custom components', () => {
    it('counts text nodes rendered by a functional component', () => {
      const Wrapper = ({ children }: { children: ReactNode }) => <div>{children}</div>;

      expect(
        countNodes(
          <Wrapper>
            <span>Child1</span>
            Child2
          </Wrapper>
        )
      ).toBe(2);
    });
  });

  describe('complex real-world structures', () => {
    it('counts text nodes in a complex nested tree', () => {
      expect(
        countNodes(
          <>
            Line 1
            <p>
              Part 1 <span>Part 2</span>
            </p>
            <div>
              <pre>
                <code>Code</code> More Code
              </pre>
            </div>
          </>
        )
      ).toBe(5);
    });
  });
});

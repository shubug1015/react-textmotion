import { Children, type ReactNode } from 'react';

import { countNodes } from './countNodes';

describe('countNodes', () => {
  const getNodes = (children: ReactNode) => Children.toArray(children);

  it('should count a single text node as 1', () => {
    const nodes = getNodes('Hello');
    expect(countNodes(nodes)).toBe(1);
  });

  it('should count multiple text nodes correctly', () => {
    const nodes = getNodes(<>Hello World</>);
    expect(countNodes(nodes)).toBe(1);

    const nodesWithSeparators = getNodes(
      <>
        {'Hello'} {'World'}
      </>
    );
    expect(countNodes(nodesWithSeparators)).toBe(3);
  });

  it('should count a single element node as 1', () => {
    const nodes = getNodes(<span>Hello</span>);
    expect(countNodes(nodes)).toBe(1);
  });

  it('should count multiple element nodes correctly', () => {
    const nodes = getNodes(
      <>
        <span>Hello</span>
        <span>World</span>
      </>
    );
    expect(countNodes(nodes)).toBe(2);
  });

  it('should count nested elements correctly', () => {
    const nodes = getNodes(
      <div>
        <span>Hello</span>
        <span>World</span>
      </div>
    );

    expect(countNodes(nodes)).toBe(2);
  });

  it('should count deeply nested elements correctly', () => {
    const nodes = getNodes(
      <div>
        <span>Hello</span>
        <p>
          <span>Deep</span>
          <span>Nested</span>
        </p>
      </div>
    );

    expect(countNodes(nodes)).toBe(3);
  });

  it('should handle mixed text and element nodes', () => {
    const nodes = getNodes(
      <>
        Start<span>Middle</span>End
      </>
    );
    expect(countNodes(nodes)).toBe(3);
  });

  it('should count nodes within an array of children', () => {
    const nodes = getNodes([
      'A',
      'B',
      <div key={0}>
        <span>C</span>
      </div>,
      'D',
    ]);

    expect(countNodes(nodes)).toBe(4);
  });

  it('should return 0 for an empty array', () => {
    const nodes = getNodes(<></>);
    expect(countNodes(nodes)).toBe(0);
  });

  it('should handle null and undefined nodes gracefully (not count them)', () => {
    const nodes = getNodes(
      <>
        {'Hello'}
        {null}
        {undefined}
        <span>World</span>
      </>
    );
    expect(countNodes(nodes)).toBe(2);
  });

  it('should count children of a functional component', () => {
    const MyComponent = ({ children }: { children: ReactNode }) => <div>{children}</div>;
    const nodes = getNodes(
      <MyComponent>
        <span>Child1</span>
        Child2
      </MyComponent>
    );

    expect(countNodes(nodes)).toBe(2);
  });

  it('should count nodes for a complex structure', () => {
    const nodes = getNodes(
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
    );

    expect(countNodes(nodes)).toBe(5);
  });
});

import { renderHook } from '@testing-library/react';

import { useTextFromReactNode } from './useTextFromReactNode';

describe('useTextFromReactNode hook', () => {
  it('should return string as is', () => {
    const { result } = renderHook(() => useTextFromReactNode('Hello'));

    expect(result.current).toBe('Hello');
  });

  it('should convert number to string', () => {
    const { result } = renderHook(() => useTextFromReactNode(123));

    expect(result.current).toBe('123');
  });

  it('should ignore null, undefined, and boolean', () => {
    const { result: r1 } = renderHook(() => useTextFromReactNode(null));
    expect(r1.current).toBe('');

    const { result: r2 } = renderHook(() => useTextFromReactNode(undefined));
    expect(r2.current).toBe('');

    const { result: r3 } = renderHook(() => useTextFromReactNode(true));
    expect(r3.current).toBe('');

    const { result: r4 } = renderHook(() => useTextFromReactNode(false));
    expect(r4.current).toBe('');
  });

  it('should concatenate array of nodes', () => {
    const { result } = renderHook(() => useTextFromReactNode(['Hello', ' ', 'World']));

    expect(result.current).toBe('Hello World');
  });

  it('should extract text from simple React element', () => {
    const element = <span>Hello</span>;
    const { result } = renderHook(() => useTextFromReactNode(element));

    expect(result.current).toBe('Hello');
  });

  it('should extract text from nested React elements', () => {
    const element = (
      <div>
        <span>Hello</span>
        <b>World</b>
      </div>
    );
    const { result } = renderHook(() => useTextFromReactNode(element));

    expect(result.current).toBe('HelloWorld');
  });

  it('should handle mixed children (string, number, element)', () => {
    const element = (
      <div>
        Hello {123} <span>World</span>
      </div>
    );
    const { result } = renderHook(() => useTextFromReactNode(element));

    expect(result.current).toBe('Hello 123 World');
  });

  it('should return empty string for React fragments without text', () => {
    const element = <></>;
    const { result } = renderHook(() => useTextFromReactNode(element));

    expect(result.current).toBe('');
  });

  it('should extract text from React fragments with text', () => {
    const element = (
      <>
        <span>Hello</span> World
      </>
    );
    const { result } = renderHook(() => useTextFromReactNode(element));

    expect(result.current).toBe('Hello World');
  });
});

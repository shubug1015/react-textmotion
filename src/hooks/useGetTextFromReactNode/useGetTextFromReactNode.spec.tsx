import { useGetTextFromReactNode } from './useGetTextFromReactNode';

describe('useGetTextFromReactNode hook', () => {
  it('should return string as is', () => {
    expect(useGetTextFromReactNode('Hello')).toBe('Hello');
  });

  it('should convert number to string', () => {
    expect(useGetTextFromReactNode(123)).toBe('123');
  });

  it('should ignore null, undefined, and boolean', () => {
    expect(useGetTextFromReactNode(null)).toBe('');
    expect(useGetTextFromReactNode(undefined)).toBe('');
    expect(useGetTextFromReactNode(true)).toBe('');
    expect(useGetTextFromReactNode(false)).toBe('');
  });

  it('should concatenate array of nodes', () => {
    expect(useGetTextFromReactNode(['Hello', ' ', 'World'])).toBe('Hello World');
  });

  it('should extract text from simple React element', () => {
    const element = <span>Hello</span>;

    expect(useGetTextFromReactNode(element)).toBe('Hello');
  });

  it('should extract text from nested React elements', () => {
    const element = (
      <div>
        <span>Hello</span>
        <b>World</b>
      </div>
    );

    expect(useGetTextFromReactNode(element)).toBe('HelloWorld');
  });

  it('should handle mixed children (string, number, element)', () => {
    const element = (
      <div>
        Hello {123} <span>World</span>
      </div>
    );

    expect(useGetTextFromReactNode(element)).toBe('Hello 123 World');
  });

  it('should return empty string for React fragments without text', () => {
    const element = <></>;

    expect(useGetTextFromReactNode(element)).toBe('');
  });

  it('should extract text from React fragments with text', () => {
    const element = (
      <>
        <span>Hello</span> World
      </>
    );

    expect(useGetTextFromReactNode(element)).toBe('Hello World');
  });
});

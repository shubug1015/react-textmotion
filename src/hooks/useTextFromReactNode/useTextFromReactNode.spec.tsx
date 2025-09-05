import { useTextFromReactNode } from './useTextFromReactNode';

describe('useTextFromReactNode hook', () => {
  it('should return string as is', () => {
    expect(useTextFromReactNode('Hello')).toBe('Hello');
  });

  it('should convert number to string', () => {
    expect(useTextFromReactNode(123)).toBe('123');
  });

  it('should ignore null, undefined, and boolean', () => {
    expect(useTextFromReactNode(null)).toBe('');
    expect(useTextFromReactNode(undefined)).toBe('');
    expect(useTextFromReactNode(true)).toBe('');
    expect(useTextFromReactNode(false)).toBe('');
  });

  it('should concatenate array of nodes', () => {
    expect(useTextFromReactNode(['Hello', ' ', 'World'])).toBe('Hello World');
  });

  it('should extract text from simple React element', () => {
    const element = <span>Hello</span>;

    expect(useTextFromReactNode(element)).toBe('Hello');
  });

  it('should extract text from nested React elements', () => {
    const element = (
      <div>
        <span>Hello</span>
        <b>World</b>
      </div>
    );

    expect(useTextFromReactNode(element)).toBe('HelloWorld');
  });

  it('should handle mixed children (string, number, element)', () => {
    const element = (
      <div>
        Hello {123} <span>World</span>
      </div>
    );

    expect(useTextFromReactNode(element)).toBe('Hello 123 World');
  });

  it('should return empty string for React fragments without text', () => {
    const element = <></>;

    expect(useTextFromReactNode(element)).toBe('');
  });

  it('should extract text from React fragments with text', () => {
    const element = (
      <>
        <span>Hello</span> World
      </>
    );

    expect(useTextFromReactNode(element)).toBe('Hello World');
  });
});

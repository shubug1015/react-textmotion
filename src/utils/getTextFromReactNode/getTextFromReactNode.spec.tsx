import { getTextFromReactNode } from './getTextFromReactNode';

describe('getTextFromReactNode', () => {
  it('should return string as is', () => {
    expect(getTextFromReactNode('Hello')).toBe('Hello');
  });

  it('should convert number to string', () => {
    expect(getTextFromReactNode(123)).toBe('123');
  });

  it('should ignore null, undefined, and boolean', () => {
    expect(getTextFromReactNode(null)).toBe('');
    expect(getTextFromReactNode(undefined)).toBe('');
    expect(getTextFromReactNode(true)).toBe('');
    expect(getTextFromReactNode(false)).toBe('');
  });

  it('should concatenate array of nodes', () => {
    expect(getTextFromReactNode(['Hello', ' ', 'World'])).toBe('Hello World');
  });

  it('should extract text from simple React element', () => {
    const element = <span>Hello</span>;

    expect(getTextFromReactNode(element)).toBe('Hello');
  });

  it('should extract text from nested React elements', () => {
    const element = (
      <div>
        <span>Hello</span>
        <b>World</b>
      </div>
    );

    expect(getTextFromReactNode(element)).toBe('HelloWorld');
  });

  it('should handle mixed children (string, number, element)', () => {
    const element = (
      <div>
        Hello {123} <span>World</span>
      </div>
    );

    expect(getTextFromReactNode(element)).toBe('Hello 123 World');
  });

  it('should return empty string for React fragments without text', () => {
    const element = <></>;

    expect(getTextFromReactNode(element)).toBe('');
  });

  it('should extract text from React fragments with text', () => {
    const element = (
      <>
        <span>Hello</span> World
      </>
    );

    expect(getTextFromReactNode(element)).toBe('Hello World');
  });
});

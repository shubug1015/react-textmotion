import { extractText } from './extractText';

describe('extractText', () => {
  it('should return string as is', () => {
    expect(extractText('Hello')).toBe('Hello');
  });

  it('should convert number to string', () => {
    expect(extractText(123)).toBe('123');
  });

  it('should ignore null, undefined, and boolean', () => {
    expect(extractText(null)).toBe('');
    expect(extractText(undefined)).toBe('');
    expect(extractText(true)).toBe('');
    expect(extractText(false)).toBe('');
  });

  it('should concatenate array of nodes', () => {
    expect(extractText(['Hello', ' ', 'World'])).toBe('Hello World');
  });

  it('should extract text from simple React element', () => {
    const element = <span>Hello</span>;

    expect(extractText(element)).toBe('Hello');
  });

  it('should extract text from nested React elements', () => {
    const element = (
      <div>
        <span>Hello</span>
        <b>World</b>
      </div>
    );

    expect(extractText(element)).toBe('HelloWorld');
  });

  it('should handle mixed children (string, number, element)', () => {
    const element = (
      <div>
        Hello {123} <span>World</span>
      </div>
    );

    expect(extractText(element)).toBe('Hello 123 World');
  });

  it('should return empty string for React fragments without text', () => {
    const element = <></>;

    expect(extractText(element)).toBe('');
  });

  it('should extract text from React fragments with text', () => {
    const element = (
      <>
        <span>Hello</span> World
      </>
    );

    expect(extractText(element)).toBe('Hello World');
  });
});

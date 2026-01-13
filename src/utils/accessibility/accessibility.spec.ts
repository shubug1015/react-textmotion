import { getAriaLabel } from './accessibility';

describe('getAriaLabel', () => {
  it('should return aria-label when text is provided', () => {
    expect(getAriaLabel('Hello')).toEqual({ 'aria-label': 'Hello' });
  });

  it('should return empty object when text is empty', () => {
    expect(getAriaLabel('')).toEqual({});
  });
});

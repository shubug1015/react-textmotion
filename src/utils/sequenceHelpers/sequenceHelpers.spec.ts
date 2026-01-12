import { calculateSequenceIndex, isLastNode } from './sequenceHelpers';

describe('calculateSequenceIndex', () => {
  it('should return the current index for "first-to-last" order', () => {
    expect(calculateSequenceIndex(0, 10, 'first-to-last')).toBe(0);
    expect(calculateSequenceIndex(5, 10, 'first-to-last')).toBe(5);
    expect(calculateSequenceIndex(9, 10, 'first-to-last')).toBe(9);
  });

  it('should return the reversed index for "last-to-first" order', () => {
    expect(calculateSequenceIndex(0, 10, 'last-to-first')).toBe(9);
    expect(calculateSequenceIndex(5, 10, 'last-to-first')).toBe(4);
    expect(calculateSequenceIndex(9, 10, 'last-to-first')).toBe(0);
  });
});

describe('isLastNode', () => {
  it('should return true if it is the last node', () => {
    expect(isLastNode(9, 10)).toBe(true);
  });

  it('should return false if it is not the last node', () => {
    expect(isLastNode(0, 10)).toBe(false);
    expect(isLastNode(8, 10)).toBe(false);
  });
});

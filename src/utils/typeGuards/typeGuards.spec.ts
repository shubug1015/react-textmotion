import { createElement } from 'react';

import { isElementWithChildren, isNullishNode, isTextNode } from './typeGuards';

describe('typeGuards', () => {
  describe('isTextNode', () => {
    it('should return true for string nodes', () => {
      expect(isTextNode('hello')).toBe(true);
    });

    it('should return true for number nodes', () => {
      expect(isTextNode(123)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isTextNode(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isTextNode(undefined)).toBe(false);
    });

    it('should return false for boolean', () => {
      expect(isTextNode(true)).toBe(false);
      expect(isTextNode(false)).toBe(false);
    });

    it('should return false for React elements', () => {
      const element = createElement('div', {}, 'hello');
      expect(isTextNode(element)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isTextNode(['hello', 'world'])).toBe(false);
    });
  });

  describe('isNullishNode', () => {
    it('should return true for null', () => {
      expect(isNullishNode(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isNullishNode(undefined)).toBe(true);
    });

    it('should return true for boolean', () => {
      expect(isNullishNode(true)).toBe(true);
      expect(isNullishNode(false)).toBe(true);
    });

    it('should return false for string', () => {
      expect(isNullishNode('hello')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isNullishNode(123)).toBe(false);
    });

    it('should return false for React elements', () => {
      const element = createElement('div', {}, 'hello');
      expect(isNullishNode(element)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isNullishNode(['hello', 'world'])).toBe(false);
    });
  });

  describe('isElementWithChildren', () => {
    it('should return true for React elements with children', () => {
      const element = createElement('div', {}, 'hello');
      expect(isElementWithChildren(element)).toBe(true);
    });

    it('should return true for React elements with empty children', () => {
      const element = createElement('div', {}, []);
      expect(isElementWithChildren(element)).toBe(true);
    });

    it('should return false for React elements without children prop', () => {
      const element = createElement('div');
      expect(isElementWithChildren(element)).toBe(false);
    });

    it('should return false for string', () => {
      expect(isElementWithChildren('hello')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isElementWithChildren(123)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isElementWithChildren(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isElementWithChildren(undefined)).toBe(false);
    });

    it('should return false for boolean', () => {
      expect(isElementWithChildren(true)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isElementWithChildren(['hello', 'world'])).toBe(false);
    });

    it('should return false for React elements without children prop', () => {
      const element = createElement('input', { type: 'text' });
      expect(isElementWithChildren(element)).toBe(false);
    });
  });
});

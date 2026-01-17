/**
 * Generates aria-label attribute for accessibility
 *
 * @param text - The text to be used as aria-label
 *
 * @returns Object with aria-label attribute
 */
export const getAriaLabel = (text: string): { 'aria-label'?: string } => {
  return text.trim() ? { 'aria-label': text } : {};
};

import { render, screen } from '@testing-library/react';

import { TextMotion } from './TextMotion';

describe('TextMotion', () => {
  it('renders an h1 with correct text', () => {
    render(<TextMotion />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('React TextMotion');
  });
});

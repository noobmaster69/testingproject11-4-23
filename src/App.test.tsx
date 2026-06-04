import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders app heading', () => {
    render(<App />);
    expect(screen.getByText(/Unit Lab/i)).toBeInTheDocument();
  });

  it('shows converted value block', () => {
    render(<App />);
    expect(screen.getAllByText(/Converted value/i).length).toBeGreaterThan(0);
  });
});

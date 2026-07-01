import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders app heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Unit Lab' })).toBeInTheDocument();
  });

  it('shows converted value block', () => {
    render(<App />);
    expect(screen.getAllByText(/Converted value/i).length).toBeGreaterThan(0);
  });

  it('shows workspace dashboard details', () => {
    render(<App />);
    expect(screen.getByText(/Convert, save, and share measurements/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Copy share link/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Workspace dashboard/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Index from '../Index';

// Mock fetch
global.fetch = vi.fn();

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the weather app heading', () => {
    const { getByText } = render(<Index />);
    expect(getByText(/Weather Forecast/i)).toBeInTheDocument();
  });

  it('renders search input and button', () => {
    const { getByPlaceholderText, getByRole } = render(<Index />);
    
    const input = getByPlaceholderText(/Enter city name/i);
    const button = getByRole('button', { name: /Get Weather/i });
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('component renders without crashing', () => {
    const { getByText } = render(<Index />);
    expect(getByText(/Weather Forecast/i)).toBeInTheDocument();
  });
});

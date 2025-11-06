import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UnitsProvider } from '@/contexts/UnitsContext';
import Index from '../Index';

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <UnitsProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </UnitsProvider>
  </QueryClientProvider>
);

// Mock fetch
global.fetch = vi.fn();

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the weather dashboard heading', () => {
    const { getByText } = render(<Index />, { wrapper: Wrapper });
    expect(getByText(/Weather Dashboard/i)).toBeInTheDocument();
  });

  it('renders search input and button', () => {
    const { getByPlaceholderText, getByRole } = render(<Index />, { wrapper: Wrapper });
    
    const input = getByPlaceholderText(/Enter city name/i);
    const searchButton = getByRole('button', { name: /Search/i });
    
    expect(input).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it('component renders without crashing', () => {
    const { getByText } = render(<Index />, { wrapper: Wrapper });
    expect(getByText(/Weather Dashboard/i)).toBeInTheDocument();
  });
});

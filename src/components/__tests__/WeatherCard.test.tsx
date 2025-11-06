import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import WeatherCard from '../WeatherCard';
import { UnitsProvider } from '@/contexts/UnitsContext';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <UnitsProvider>{children}</UnitsProvider>
);

describe('WeatherCard', () => {
  const mockWeatherData = {
    name: 'London',
    sys: {
      country: 'GB',
      sunrise: 1609488000,
      sunset: 1609516800,
    },
    main: {
      temp: 15,
      humidity: 70,
      feels_like: 13,
      pressure: 1013,
    },
    weather: [
      {
        description: 'clear sky',
        main: 'Clear',
        id: 0,
      },
    ],
    wind: {
      speed: 5.5,
    },
    visibility: 10000,
    uv_index: 3,
  };

  it('renders weather information correctly', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />, { wrapper: Wrapper });
    
    expect(getByText(/London, GB/i)).toBeInTheDocument();
    expect(getByText(/15°/i)).toBeInTheDocument();
    expect(getByText(/clear sky/i)).toBeInTheDocument();
  });

  it('displays humidity information', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />, { wrapper: Wrapper });
    
    expect(getByText(/70%/i)).toBeInTheDocument();
    expect(getByText(/Humidity/i)).toBeInTheDocument();
  });

  it('displays wind speed', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />, { wrapper: Wrapper });
    
    expect(getByText(/Wind Speed/i)).toBeInTheDocument();
  });

  it('shows sunrise and sunset times', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />, { wrapper: Wrapper });
    
    expect(getByText(/Sunrise/i)).toBeInTheDocument();
    expect(getByText(/Sunset/i)).toBeInTheDocument();
  });

  it('displays additional metrics', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />, { wrapper: Wrapper });
    
    expect(getByText(/Visibility/i)).toBeInTheDocument();
    expect(getByText(/Pressure/i)).toBeInTheDocument();
    expect(getByText(/UV Index/i)).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WeatherCard } from '../WeatherCard';

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
    },
    weather: [
      {
        description: 'clear sky',
        main: 'Clear',
      },
    ],
    wind: {
      speed: 5.5,
    },
  };

  it('renders weather information correctly', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />);
    
    expect(getByText(/London, GB/i)).toBeInTheDocument();
    expect(getByText(/15°C/i)).toBeInTheDocument();
    expect(getByText(/clear sky/i)).toBeInTheDocument();
  });

  it('displays humidity information', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />);
    
    expect(getByText(/70%/i)).toBeInTheDocument();
    expect(getByText(/Humidity/i)).toBeInTheDocument();
  });

  it('displays wind speed', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />);
    
    expect(getByText(/5.5 m\/s/i)).toBeInTheDocument();
    expect(getByText(/Wind/i)).toBeInTheDocument();
  });

  it('shows sunrise and sunset times', () => {
    const { getByText } = render(<WeatherCard data={mockWeatherData} />);
    
    expect(getByText(/Sunrise/i)).toBeInTheDocument();
    expect(getByText(/Sunset/i)).toBeInTheDocument();
  });
});

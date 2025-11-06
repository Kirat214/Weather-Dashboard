export interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    main: string;
    id: number;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  uv_index: number;
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  weather_code: number;
  precipitation_probability: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weather_code: number;
  precipitation_probability: number;
}

export interface ExtendedWeatherData extends WeatherData {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}

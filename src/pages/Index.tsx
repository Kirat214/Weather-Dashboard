import { useState, useEffect } from "react";
import { Search, CloudRain, Loader2, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeatherCard from "@/components/WeatherCard";
import { DailyForecast } from "@/components/DailyForecast";
import { HourlyForecast } from "@/components/HourlyForecast";
import { UnitsToggle } from "@/components/UnitsToggle";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getBackgroundGradient, getWeatherDescription, getWeatherMain } from "@/utils/weatherUtils";
import type { ExtendedWeatherData } from "@/types/weather";

const Index = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<ExtendedWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundGradient, setBackgroundGradient] = useState<string>('var(--gradient-sky)');
  const { latitude, longitude, getCurrentLocation, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherByCoords(latitude, longitude);
    }
  }, [latitude, longitude]);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
      );
      
      const geoData = await geoResponse.json();
      const cityName = geoData.results?.[0]?.name || "Current Location";
      
      await fetchWeatherData(lat, lon, cityName, geoData.results?.[0]?.country || "");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number, name: string, country: string) => {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=7`
    );

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data. Please try again later.");
    }

    const data = await weatherResponse.json();
    
    const transformedData: ExtendedWeatherData = {
      name,
      sys: {
        country,
        sunrise: new Date(data.daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(data.daily.sunset[0]).getTime() / 1000,
      },
      main: {
        temp: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        feels_like: data.current.apparent_temperature,
        pressure: data.current.pressure_msl,
      },
      weather: [
        {
          description: getWeatherDescription(data.current.weather_code),
          main: getWeatherMain(data.current.weather_code),
          id: data.current.weather_code,
        },
      ],
      wind: {
        speed: data.current.wind_speed_10m,
      },
      visibility: 10000,
      uv_index: data.daily.uv_index_max[0],
      daily: data.daily.time.map((date: string, index: number) => ({
        date,
        temp_max: data.daily.temperature_2m_max[index],
        temp_min: data.daily.temperature_2m_min[index],
        weather_code: data.daily.weather_code[index],
        precipitation_probability: data.daily.precipitation_probability_max[index],
      })),
      hourly: data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
        time,
        temperature: data.hourly.temperature_2m[index],
        weather_code: data.hourly.weather_code[index],
        precipitation_probability: data.hourly.precipitation_probability[index],
      })),
    };

    setWeatherData(transformedData);
    
    const isDark = document.documentElement.classList.contains('dark');
    setBackgroundGradient(getBackgroundGradient(transformedData.weather[0].main, isDark));
    
    toast.success(`Weather data loaded for ${name}`);
  };

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get coordinates from city name using Open-Meteo Geocoding API
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location
        )}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("Failed to fetch location data. Please try again later.");
      }

      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please check the spelling and try again.");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      await fetchWeatherData(latitude, longitude, name, country);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div 
      className="min-h-screen transition-all duration-1000"
      style={{ background: backgroundGradient }}
    >
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudRain className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Weather Dashboard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Get real-time weather information for any city worldwide
          </p>
          <UnitsToggle />
        </header>

        {/* Search Form */}
        <form onSubmit={fetchWeather} className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter city name (e.g., London, Tokyo, New York)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-14 pl-12 text-lg border-2 bg-card/90 backdrop-blur-sm focus:border-primary transition-all"
                disabled={loading}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <Button
              type="button"
              size="lg"
              variant="outline"
              disabled={loading || geoLoading}
              onClick={getCurrentLocation}
              className="h-14 px-6 bg-card/90 backdrop-blur-sm border-2 hover:bg-card"
            >
              {geoLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-14 px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg hover:shadow-[var(--shadow-glow)]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 rounded-lg bg-destructive/10 border border-destructive/20 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Loading weather data...</p>
          </div>
        )}

        {/* Weather Data */}
        {weatherData && !loading && (
          <div className="space-y-6 animate-fade-in">
            <WeatherCard data={weatherData} />
            <HourlyForecast forecast={weatherData.hourly} />
            <DailyForecast forecast={weatherData.daily} />
          </div>
        )}

        {/* Initial State */}
        {!weatherData && !loading && !error && (
          <div className="text-center py-20 animate-fade-in">
            <CloudRain className="w-24 h-24 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Search for a City
            </h2>
            <p className="text-muted-foreground">
              Enter a city name above to view current weather conditions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

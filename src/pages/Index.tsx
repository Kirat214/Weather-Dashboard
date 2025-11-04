import { useState } from "react";
import { Search, CloudRain, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeatherCard from "@/components/WeatherCard";
import { toast } from "sonner";

interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
}

const Index = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Then, get weather data using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data. Please try again later.");
      }

      const weatherData = await weatherResponse.json();
      
      // Transform Open-Meteo data to match our WeatherData interface
      const transformedData: WeatherData = {
        name,
        sys: {
          country,
          sunrise: new Date(weatherData.daily.sunrise[0]).getTime() / 1000,
          sunset: new Date(weatherData.daily.sunset[0]).getTime() / 1000,
        },
        main: {
          temp: weatherData.current.temperature_2m,
          humidity: weatherData.current.relative_humidity_2m,
        },
        weather: [
          {
            description: getWeatherDescription(weatherData.current.weather_code),
            main: getWeatherMain(weatherData.current.weather_code),
          },
        ],
        wind: {
          speed: weatherData.current.wind_speed_10m,
        },
      };

      setWeatherData(transformedData);
      toast.success(`Weather data loaded for ${name}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert WMO weather codes to descriptions
  const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
      0: "clear sky",
      1: "mainly clear",
      2: "partly cloudy",
      3: "overcast",
      45: "foggy",
      48: "depositing rime fog",
      51: "light drizzle",
      53: "moderate drizzle",
      55: "dense drizzle",
      61: "slight rain",
      63: "moderate rain",
      65: "heavy rain",
      71: "slight snow",
      73: "moderate snow",
      75: "heavy snow",
      77: "snow grains",
      80: "slight rain showers",
      81: "moderate rain showers",
      82: "violent rain showers",
      85: "slight snow showers",
      86: "heavy snow showers",
      95: "thunderstorm",
      96: "thunderstorm with slight hail",
      99: "thunderstorm with heavy hail",
    };
    return descriptions[code] || "unknown";
  };

  const getWeatherMain = (code: number): string => {
    if (code === 0 || code === 1) return "Clear";
    if (code === 2 || code === 3) return "Clouds";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain";
    if (code >= 85 && code <= 86) return "Snow";
    if (code >= 95) return "Thunderstorm";
    return "Unknown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 bg-[var(--gradient-sky)]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudRain className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Weather Dashboard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get real-time weather information for any city worldwide
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={fetchWeather} className="max-w-2xl mx-auto mb-12">
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

        {/* Weather Card */}
        {weatherData && !loading && (
          <div className="animate-fade-in">
            <WeatherCard data={weatherData} />
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

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
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        throw new Error("API key not configured. Please add VITE_OPENWEATHER_API_KEY to your environment variables.");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          location
        )}&units=metric&appid=${apiKey}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the spelling and try again.");
        }
        throw new Error("Failed to fetch weather data. Please try again later.");
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
      toast.success(`Weather data loaded for ${data.name}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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

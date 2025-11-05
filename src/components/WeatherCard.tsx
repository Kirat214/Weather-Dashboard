import { Cloud, Droplets, Wind, Sunrise, Sunset, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";

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

interface WeatherCardProps {
  data: WeatherData;
}

export const WeatherCard = ({ data }: WeatherCardProps) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 backdrop-blur-lg bg-card/90 border-border/50 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
      {/* Location Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">
          {data.name}, {data.sys.country}
        </h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Cloud className="w-5 h-5" />
          <p className="text-lg capitalize">{data.weather[0].description}</p>
        </div>
      </div>

      {/* Temperature Display */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3">
          <Thermometer className="w-12 h-12 text-primary" />
          <span className="text-7xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
            {Math.round(data.main.temp)}°C
          </span>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted">
          <Droplets className="w-8 h-8 text-accent mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Humidity</p>
          <p className="text-2xl font-semibold text-foreground">{data.main.humidity}%</p>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted">
          <Wind className="w-8 h-8 text-secondary mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Wind Speed</p>
          <p className="text-2xl font-semibold text-foreground">{data.wind.speed} m/s</p>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted">
          <Sunrise className="w-8 h-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Sunrise</p>
          <p className="text-2xl font-semibold text-foreground">{formatTime(data.sys.sunrise)}</p>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted">
          <Sunset className="w-8 h-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Sunset</p>
          <p className="text-2xl font-semibold text-foreground">{formatTime(data.sys.sunset)}</p>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;

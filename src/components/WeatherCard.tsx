import { Card } from "@/components/ui/card";
import { Droplets, Wind, Sunrise, Sunset, Eye, Gauge, Thermometer, Sun } from "lucide-react";
import { useUnits } from "@/contexts/UnitsContext";
import { getWeatherIcon } from "@/utils/weatherUtils";
import type { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const { convertTemperature, convertSpeed, temperatureUnit, speedUnit } = useUnits();
  const WeatherIcon = getWeatherIcon(data.weather[0].id);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="max-w-6xl mx-auto p-8 bg-[var(--gradient-card)] backdrop-blur-sm shadow-[var(--shadow-card)] border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-2">
            {data.name}, {data.sys.country}
          </h2>
          <p className="text-xl text-muted-foreground capitalize flex items-center gap-2">
            <WeatherIcon className="w-6 h-6" />
            {data.weather[0].description}
          </p>
        </div>
        <WeatherIcon className="w-20 h-20 text-primary" />
      </div>

      {/* Temperature */}
      <div className="text-center mb-10">
        <div className="text-7xl font-bold text-primary mb-2">
          {Math.round(convertTemperature(data.main.temp))}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
        </div>
        <p className="text-lg text-muted-foreground">
          Feels like {Math.round(convertTemperature(data.main.feels_like))}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
        </p>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/30 hover:bg-card/80 transition-all">
          <Droplets className="w-8 h-8 text-accent mb-2" />
          <span className="text-sm text-muted-foreground">Humidity</span>
          <span className="text-xl font-semibold text-foreground">{data.main.humidity}%</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/30 hover:bg-card/80 transition-all">
          <Wind className="w-8 h-8 text-primary mb-2" />
          <span className="text-sm text-muted-foreground">Wind Speed</span>
          <span className="text-xl font-semibold text-foreground">
            {Math.round(convertSpeed(data.wind.speed))} {speedUnit}
          </span>
        </div>

        <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/30 hover:bg-card/80 transition-all">
          <Sunrise className="w-8 h-8 text-secondary mb-2" />
          <span className="text-sm text-muted-foreground">Sunrise</span>
          <span className="text-xl font-semibold text-foreground">
            {formatTime(data.sys.sunrise)}
          </span>
        </div>

        <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/30 hover:bg-card/80 transition-all">
          <Sunset className="w-8 h-8 text-secondary mb-2" />
          <span className="text-sm text-muted-foreground">Sunset</span>
          <span className="text-xl font-semibold text-foreground">
            {formatTime(data.sys.sunset)}
          </span>
        </div>

        <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/30 hover:bg-card/80 transition-all">
          <Eye className="w-8 h-8 text-primary mb-2" />
          <span className="text-sm text-muted-foreground">Visibility</span>
          <span className="text-xl font-semibold text-foreground">
            {(data.visibility / 1000).toFixed(1)} km
          </span>
        </div>

        <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/30 hover:bg-card/80 transition-all">
          <Gauge className="w-8 h-8 text-accent mb-2" />
          <span className="text-sm text-muted-foreground">Pressure</span>
          <span className="text-xl font-semibold text-foreground">{data.main.pressure} hPa</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/30 hover:bg-card/80 transition-all">
          <Thermometer className="w-8 h-8 text-destructive mb-2" />
          <span className="text-sm text-muted-foreground">Feels Like</span>
          <span className="text-xl font-semibold text-foreground">
            {Math.round(convertTemperature(data.main.feels_like))}°
          </span>
        </div>

        <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/30 hover:bg-card/80 transition-all">
          <Sun className="w-8 h-8 text-secondary mb-2" />
          <span className="text-sm text-muted-foreground">UV Index</span>
          <span className="text-xl font-semibold text-foreground">{data.uv_index}</span>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;

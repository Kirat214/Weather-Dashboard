import { Card } from "@/components/ui/card";
import { DailyForecast as DailyForecastType } from "@/types/weather";
import { useUnits } from "@/contexts/UnitsContext";
import { getWeatherIcon, getWeatherDescription } from "@/utils/weatherUtils";
import { format } from "date-fns";

interface DailyForecastProps {
  forecast: DailyForecastType[];
}

export const DailyForecast = ({ forecast }: DailyForecastProps) => {
  const { convertTemperature, temperatureUnit } = useUnits();

  return (
    <Card className="p-6 bg-[var(--gradient-card)] backdrop-blur-sm border-border/50 shadow-[var(--shadow-card)]">
      <h2 className="text-2xl font-bold mb-6 text-foreground">7-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {forecast.map((day, index) => {
          const Icon = getWeatherIcon(day.weather_code);
          const date = new Date(day.date);
          
          return (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-all hover:scale-105 border border-border/30"
            >
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {index === 0 ? 'Today' : format(date, 'EEE')}
              </p>
              <Icon className="w-10 h-10 text-primary mb-2" />
              <p className="text-xs text-muted-foreground mb-2">
                {getWeatherDescription(day.weather_code)}
              </p>
              <div className="flex gap-2 text-sm">
                <span className="font-bold text-foreground">
                  {Math.round(convertTemperature(day.temp_max))}°
                </span>
                <span className="text-muted-foreground">
                  {Math.round(convertTemperature(day.temp_min))}°
                </span>
              </div>
              {day.precipitation_probability > 0 && (
                <p className="text-xs text-accent mt-1">
                  {day.precipitation_probability}%
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

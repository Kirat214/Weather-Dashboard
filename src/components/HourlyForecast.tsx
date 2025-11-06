import { Card } from "@/components/ui/card";
import { HourlyForecast as HourlyForecastType } from "@/types/weather";
import { useUnits } from "@/contexts/UnitsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface HourlyForecastProps {
  forecast: HourlyForecastType[];
}

export const HourlyForecast = ({ forecast }: HourlyForecastProps) => {
  const { convertTemperature, temperatureUnit } = useUnits();

  const chartData = forecast.slice(0, 24).map((hour) => ({
    time: format(new Date(hour.time), 'ha'),
    temp: Math.round(convertTemperature(hour.temperature)),
    precipitation: hour.precipitation_probability,
  }));

  return (
    <Card className="p-6 bg-[var(--gradient-card)] backdrop-blur-sm border-border/50 shadow-[var(--shadow-card)]">
      <h2 className="text-2xl font-bold mb-6 text-foreground">24-Hour Forecast</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            label={{ 
              value: `Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`, 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'hsl(var(--muted-foreground))' }
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'temp') return [`${value}°${temperatureUnit === 'celsius' ? 'C' : 'F'}`, 'Temperature'];
              if (name === 'precipitation') return [`${value}%`, 'Precipitation'];
              return [value, name];
            }}
          />
          <Line 
            type="monotone" 
            dataKey="temp" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="precipitation" 
            stroke="hsl(var(--accent))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--accent))', r: 3 }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary"></div>
          <span className="text-sm text-muted-foreground">Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-accent" style={{ borderTop: '2px dashed' }}></div>
          <span className="text-sm text-muted-foreground">Precipitation</span>
        </div>
      </div>
    </Card>
  );
};

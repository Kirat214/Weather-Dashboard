import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";
import { Thermometer, Wind } from "lucide-react";

export const UnitsToggle = () => {
  const { temperatureUnit, speedUnit, toggleTemperatureUnit, toggleSpeedUnit } = useUnits();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTemperatureUnit}
        className="gap-2 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card"
      >
        <Thermometer className="w-4 h-4" />
        °{temperatureUnit === 'celsius' ? 'C' : 'F'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSpeedUnit}
        className="gap-2 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card"
      >
        <Wind className="w-4 h-4" />
        {speedUnit === 'kmh' ? 'km/h' : 'mph'}
      </Button>
    </div>
  );
};

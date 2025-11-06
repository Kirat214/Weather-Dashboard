import { createContext, useContext, useState, ReactNode } from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';
type SpeedUnit = 'kmh' | 'mph';

interface UnitsContextType {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  toggleTemperatureUnit: () => void;
  toggleSpeedUnit: () => void;
  convertTemperature: (temp: number) => number;
  convertSpeed: (speed: number) => number;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export const UnitsProvider = ({ children }: { children: ReactNode }) => {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kmh');

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const toggleSpeedUnit = () => {
    setSpeedUnit(prev => prev === 'kmh' ? 'mph' : 'kmh');
  };

  const convertTemperature = (temp: number) => {
    if (temperatureUnit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  const convertSpeed = (speed: number) => {
    if (speedUnit === 'mph') {
      return speed * 0.621371;
    }
    return speed;
  };

  return (
    <UnitsContext.Provider value={{
      temperatureUnit,
      speedUnit,
      toggleTemperatureUnit,
      toggleSpeedUnit,
      convertTemperature,
      convertSpeed,
    }}>
      {children}
    </UnitsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUnits = () => {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
};

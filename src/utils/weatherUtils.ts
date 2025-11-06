import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning,
  type LucideIcon 
} from "lucide-react";

export const getWeatherIcon = (code: number): LucideIcon => {
  if (code === 0 || code === 1) return Sun;
  if (code === 2 || code === 3) return Cloud;
  if (code >= 45 && code <= 48) return CloudFog;
  if (code >= 51 && code <= 57) return CloudDrizzle;
  if (code >= 61 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 80 && code <= 82) return CloudRain;
  if (code >= 85 && code <= 86) return CloudSnow;
  if (code >= 95) return CloudLightning;
  return Cloud;
};

export const getWeatherDescription = (code: number): string => {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Severe thunderstorm",
  };
  return descriptions[code] || "Unknown";
};

export const getWeatherMain = (code: number): string => {
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

export const getBackgroundGradient = (weatherMain: string, isDark: boolean): string => {
  const gradients: Record<string, { light: string; dark: string }> = {
    Clear: {
      light: 'linear-gradient(135deg, hsl(210 100% 50%) 0%, hsl(45 100% 60%) 100%)',
      dark: 'linear-gradient(135deg, hsl(215 28% 17%) 0%, hsl(220 26% 25%) 100%)',
    },
    Clouds: {
      light: 'linear-gradient(135deg, hsl(200 20% 70%) 0%, hsl(210 20% 85%) 100%)',
      dark: 'linear-gradient(135deg, hsl(215 25% 20%) 0%, hsl(215 20% 30%) 100%)',
    },
    Rain: {
      light: 'linear-gradient(135deg, hsl(200 50% 50%) 0%, hsl(210 50% 60%) 100%)',
      dark: 'linear-gradient(135deg, hsl(210 30% 15%) 0%, hsl(215 30% 22%) 100%)',
    },
    Snow: {
      light: 'linear-gradient(135deg, hsl(200 30% 85%) 0%, hsl(210 30% 95%) 100%)',
      dark: 'linear-gradient(135deg, hsl(210 20% 25%) 0%, hsl(215 20% 35%) 100%)',
    },
    Thunderstorm: {
      light: 'linear-gradient(135deg, hsl(220 30% 40%) 0%, hsl(230 30% 50%) 100%)',
      dark: 'linear-gradient(135deg, hsl(220 40% 10%) 0%, hsl(230 40% 18%) 100%)',
    },
    Fog: {
      light: 'linear-gradient(135deg, hsl(210 15% 75%) 0%, hsl(200 15% 85%) 100%)',
      dark: 'linear-gradient(135deg, hsl(215 20% 22%) 0%, hsl(210 20% 28%) 100%)',
    },
  };

  const gradient = gradients[weatherMain] || gradients.Clear;
  return isDark ? gradient.dark : gradient.light;
};

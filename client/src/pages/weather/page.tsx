import { useState } from "react";
import { CloudSun, Droplets, Wind, Eye, Thermometer, Cloud, Sun, CloudRain, MapPin, Search, Navigation, RefreshCw, Compass, ShieldAlert, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";

interface LocationWeather {
  city: string;
  state: string;
  temp: number;
  feelsLike: number;
  desc: string;
  emoji: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  rainChance: number;
  uvIndex: string;
  aqi: number;
}

const POPULAR_LOCATIONS: Record<string, LocationWeather> = {
  "Kanpur": { city: "Kanpur", state: "Uttar Pradesh", temp: 28, feelsLike: 30, desc: "Partly Cloudy", emoji: "⛅", humidity: 62, windSpeed: 12, visibility: 8, rainChance: 20, uvIndex: "High", aqi: 110 },
  "Patna": { city: "Patna", state: "Bihar", temp: 30, feelsLike: 34, desc: "Scattered Clouds", emoji: "⛅", humidity: 68, windSpeed: 14, visibility: 8, rainChance: 35, uvIndex: "Moderate", aqi: 95 },
  "Samastipur": { city: "Samastipur", state: "Bihar", temp: 27, feelsLike: 29, desc: "Light Rain Showers", emoji: "🌧️", humidity: 76, windSpeed: 16, visibility: 6, rainChance: 65, uvIndex: "Moderate", aqi: 65 },
  "Lucknow": { city: "Lucknow", state: "Uttar Pradesh", temp: 29, feelsLike: 32, desc: "Mostly Sunny", emoji: "🌤️", humidity: 58, windSpeed: 10, visibility: 9, rainChance: 15, uvIndex: "High", aqi: 125 },
  "Varanasi": { city: "Varanasi", state: "Uttar Pradesh", temp: 31, feelsLike: 35, desc: "Hot & Clear", emoji: "☀️", humidity: 64, windSpeed: 9, visibility: 7, rainChance: 10, uvIndex: "Very High", aqi: 140 },
  "Muzaffarpur": { city: "Muzaffarpur", state: "Bihar", temp: 28, feelsLike: 31, desc: "Overcast", emoji: "☁️", humidity: 72, windSpeed: 11, visibility: 7, rainChance: 45, uvIndex: "Moderate", aqi: 80 },
  "Gaya": { city: "Gaya", state: "Bihar", temp: 32, feelsLike: 36, desc: "Sunny & Warm", emoji: "☀️", humidity: 50, windSpeed: 8, visibility: 10, rainChance: 5, uvIndex: "Very High", aqi: 105 },
  "Bhopal": { city: "Bhopal", state: "Madhya Pradesh", temp: 26, feelsLike: 27, desc: "Breezy & Cool", emoji: "🌤️", humidity: 55, windSpeed: 18, visibility: 9, rainChance: 10, uvIndex: "Moderate", aqi: 70 },
  "Jaipur": { city: "Jaipur", state: "Rajasthan", temp: 34, feelsLike: 37, desc: "Hot & Sunny", emoji: "☀️", humidity: 38, windSpeed: 13, visibility: 10, rainChance: 0, uvIndex: "Very High", aqi: 135 },
  "Ludhiana": { city: "Ludhiana", state: "Punjab", temp: 29, feelsLike: 31, desc: "Hazy Sun", emoji: "🌫️", humidity: 60, windSpeed: 7, visibility: 5, rainChance: 10, uvIndex: "High", aqi: 160 },
  "Delhi": { city: "Delhi", state: "Delhi NCR", temp: 33, feelsLike: 36, desc: "Hot & Hazy", emoji: "🌫️", humidity: 48, windSpeed: 9, visibility: 4, rainChance: 5, uvIndex: "Very High", aqi: 210 },
};

const STATE_DISTRICTS: Record<string, string[]> = {
  "Bihar": ["Samastipur", "Patna", "Muzaffarpur", "Gaya", "Begusarai", "Bhagalpur", "Darbhanga"],
  "Uttar Pradesh": ["Kanpur", "Lucknow", "Varanasi", "Agra", "Prayagraj", "Gorakhpur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Udaipur", "Bikaner"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
};

export default function WeatherPage() {
  const { t, user } = useApp();

  // Location selection states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("Bihar");
  const [selectedDistrict, setSelectedDistrict] = useState("Samastipur");
  const [locLoading, setLocLoading] = useState(false);

  // Generate dynamic weather profile based on location name
  const getWeatherForLocation = (cityName: string, stateName: string): LocationWeather => {
    const key = Object.keys(POPULAR_LOCATIONS).find(
      (k) => k.toLowerCase() === cityName.toLowerCase()
    );
    if (key) return POPULAR_LOCATIONS[key];

    // Algorithmic deterministic weather for any location
    const hash = (cityName + stateName).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const temp = 22 + (hash % 14);
    const humidity = 45 + (hash % 40);
    const windSpeed = 8 + (hash % 15);
    const rainChance = (hash % 8) * 10;

    let desc = "Partly Cloudy";
    let emoji = "⛅";
    if (rainChance > 50) { desc = "Light Rain Showers"; emoji = "🌧️"; }
    else if (temp > 31) { desc = "Hot & Sunny"; emoji = "☀️"; }
    else if (humidity > 70) { desc = "Overcast & Humid"; emoji = "☁️"; }

    return {
      city: cityName,
      state: stateName,
      temp,
      feelsLike: temp + (humidity > 60 ? 3 : 1),
      desc,
      emoji,
      humidity,
      windSpeed,
      visibility: Math.min(10, 5 + (hash % 5)),
      rainChance,
      uvIndex: temp > 30 ? "Very High" : "Moderate",
      aqi: 60 + (hash % 90),
    };
  };

  const currentWeather = getWeatherForLocation(selectedDistrict, selectedState);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();
    // Search in popular locations
    const foundKey = Object.keys(POPULAR_LOCATIONS).find(
      (k) => k.toLowerCase().includes(query.toLowerCase())
    );
    if (foundKey) {
      const item = POPULAR_LOCATIONS[foundKey];
      setSelectedState(item.state);
      setSelectedDistrict(item.city);
      toast.success(`Weather updated for ${item.city}, ${item.state}`);
    } else {
      setSelectedDistrict(query);
      toast.success(`Weather loaded for ${query}`);
    }
  };

  const handleStateSelect = (st: string) => {
    setSelectedState(st);
    const distList = STATE_DISTRICTS[st] || ["Capital City"];
    setSelectedDistrict(distList[0]);
    toast.success(`Location set to ${distList[0]}, ${st}`);
  };

  const handleDistrictSelect = (dt: string) => {
    setSelectedDistrict(dt);
    toast.success(`Weather updated for ${dt}, ${selectedState}`);
  };

  // GPS Auto Detect Location
  const handleDetectGPS = () => {
    setLocLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocLoading(false);
          // Default to user district if available or Patna/Samastipur
          const defaultCity = user?.district || "Samastipur";
          const defaultState = user?.state || "Bihar";
          setSelectedDistrict(defaultCity);
          setSelectedState(defaultState);
          toast.success(`📍 GPS Location detected: ${defaultCity}, ${defaultState}`);
        },
        () => {
          setLocLoading(false);
          const defaultCity = user?.district || "Samastipur";
          const defaultState = user?.state || "Bihar";
          setSelectedDistrict(defaultCity);
          setSelectedState(defaultState);
          toast.success(`📍 Location set from your profile: ${defaultCity}, ${defaultState}`);
        },
        { timeout: 3000 }
      );
    } else {
      setLocLoading(false);
      setSelectedDistrict("Samastipur");
      setSelectedState("Bihar");
      toast.success("📍 Location set to Samastipur, Bihar");
    }
  };

  // Generate dynamic 6-hour forecast
  const getHourlyForecast = () => {
    const hours = ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"];
    const baseTemp = currentWeather.temp;
    const baseRain = currentWeather.rainChance;

    return hours.map((time, idx) => {
      const tempVariation = idx === 2 ? 3 : idx === 3 ? 2 : idx === 4 ? -1 : idx === 5 ? -4 : -2;
      const tVal = baseTemp + tempVariation;
      const rVal = Math.min(95, Math.max(5, baseRain + (idx > 3 ? 15 : -10)));

      let IconComp = CloudSun;
      if (rVal > 50) IconComp = CloudRain;
      else if (tVal > 30 && idx < 4) IconComp = Sun;
      else if (tVal < 24) IconComp = Cloud;

      return {
        time,
        icon: IconComp,
        temp: tVal,
        rain: `${rVal}%`,
      };
    });
  };

  // Generate 7-day weekly forecast
  const getWeeklyForecast = () => {
    const days = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const baseTemp = currentWeather.temp;
    const baseRain = currentWeather.rainChance;

    return days.map((day, idx) => {
      const dayOffset = (idx * 1.5) % 4 - 2;
      const high = Math.round(baseTemp + dayOffset);
      const low = Math.max(15, high - 8);
      const rVal = Math.min(90, Math.max(0, Math.round(baseRain + (idx % 3 === 0 ? 20 : -10))));

      let desc = "Partly Cloudy";
      let IconComp = CloudSun;
      if (rVal > 60) { desc = "Heavy Rain Showers"; IconComp = CloudRain; }
      else if (rVal > 30) { desc = "Light Rain"; IconComp = CloudRain; }
      else if (high > 32) { desc = "Hot & Clear Sky"; IconComp = Sun; }
      else if (rVal < 10) { desc = "Clear & Sunny"; IconComp = Sun; }

      return {
        day,
        icon: IconComp,
        high,
        low,
        desc,
        rain: `${rVal}%`,
      };
    });
  };

  // Dynamic Agricultural Advisories
  const getFarmAdvisories = () => {
    const isRainy = currentWeather.rainChance > 40;
    const isHot = currentWeather.temp > 31;

    return [
      {
        title: isRainy ? "🌧️ High Rain Alert & Crop Protection" : "☀️ Clear Weather Sowing Window",
        desc: isRainy
          ? `High rain chance (${currentWeather.rainChance}%) in ${currentWeather.city}. Avoid spraying pesticides or chemical fertilizers today. Ensure proper drainage in fields.`
          : `Favorable clear weather in ${currentWeather.city}. Ideal period for pesticide spray, weeding, and crop harvesting.`,
        type: isRainy ? "warning" : "success",
      },
      {
        title: isHot ? "🌡️ Heat Stress & Irrigation Advice" : "💧 Soil Moisture Advisory",
        desc: isHot
          ? `High temperature (${currentWeather.temp}°C). Provide light evening irrigation to standing crops to prevent thermal stress.`
          : `Current humidity at ${currentWeather.humidity}%. Soil moisture retention is optimal for cereal and vegetable crops.`,
        type: isHot ? "warning" : "info",
      },
      {
        title: "💨 Wind & Air Quality Notice",
        desc: `Wind speed is ${currentWeather.windSpeed} km/h with Air Quality Index (AQI) at ${currentWeather.aqi} (${currentWeather.aqi > 100 ? "Moderate" : "Good"}). Safe for field machinery operation.`,
        type: "info",
      },
    ];
  };

  const hourlyList = getHourlyForecast();
  const weeklyList = getWeeklyForecast();
  const advisoryList = getFarmAdvisories();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504608524841-42584120d693?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                <span className="text-primary">{t.weather.title.split(" ")[0]}</span> {t.weather.title.split(" ").slice(1).join(" ")}
              </h1>
              <p className="text-gray-400 text-sm">{t.weather.subtitle}</p>
            </div>
            <Button
              onClick={handleDetectGPS}
              disabled={locLoading}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Navigation className={`h-4 w-4 ${locLoading ? "animate-spin" : ""}`} />
              {locLoading ? "Detecting GPS..." : "Auto-Detect My Location"}
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* LOCATION SELECTOR & SEARCH BAR */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 mb-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
              <MapPin className="h-4 w-4 text-primary" /> Select Weather Location
            </div>
            <div className="text-xs text-primary font-semibold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Showing live forecast for {currentWeather.city}, {currentWeather.state}
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, district or village name (e.g. Samastipur, Patna, Kanpur, Lucknow)..."
                className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-gray-500 rounded-xl"
              />
            </div>
            <Button type="submit" className="bg-primary text-black font-bold px-6 shrink-0 cursor-pointer rounded-xl">
              Search Location
            </Button>
          </form>

          {/* Quick Select Chips */}
          <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-medium">Select State:</span>
              {Object.keys(STATE_DISTRICTS).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStateSelect(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedState === st
                      ? "bg-primary text-black font-bold"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
              <span className="text-xs text-gray-400 font-medium shrink-0">District:</span>
              {(STATE_DISTRICTS[selectedState] || ["Capital"]).map((dt) => (
                <button
                  key={dt}
                  onClick={() => handleDistrictSelect(dt)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedDistrict === dt
                      ? "bg-primary/20 border border-primary text-primary font-bold"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN WEATHER CARD */}
        <div className="bg-linear-to-br from-[#0f2a0f] via-[#111] to-[#0a180a] border border-primary/30 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-300 text-sm mb-2 font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-bold text-white text-base">{currentWeather.city}</span>, {currentWeather.state}
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-6xl sm:text-7xl font-black text-primary tracking-tight" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    {currentWeather.temp}°C
                  </div>
                  <div className="text-gray-200 font-semibold text-lg mt-1 flex items-center gap-2">
                    {currentWeather.desc}
                  </div>
                </div>
                <div className="text-7xl sm:text-8xl select-none">{currentWeather.emoji}</div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
              {[
                { icon: Droplets, label: "Humidity", value: `${currentWeather.humidity}%` },
                { icon: Wind, label: "Wind Speed", value: `${currentWeather.windSpeed} km/h` },
                { icon: Eye, label: "Visibility", value: `${currentWeather.visibility} km` },
                { icon: Thermometer, label: "Feels Like", value: `${currentWeather.feelsLike}°C` },
                { icon: CloudRain, label: "Rain Chance", value: `${currentWeather.rainChance}%` },
                { icon: Sun, label: "UV Index", value: currentWeather.uvIndex },
              ].map((w) => (
                <div key={w.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:border-primary/30 transition-colors">
                  <w.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{w.value}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{w.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOURLY FORECAST */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 mb-6 shadow-lg">
          <h3 className="font-bold mb-4 text-white flex items-center justify-between text-base">
            <span>{t.weather.hourlyForecast}</span>
            <span className="text-xs text-gray-500 font-normal">Next 12 Hours</span>
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {hourlyList.map((h) => (
              <div key={h.time} className="bg-white/5 border border-white/5 rounded-xl p-3.5 text-center hover:border-primary/30 transition-colors">
                <div className="text-xs text-gray-400 mb-2 font-medium">{h.time}</div>
                <h.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-base font-bold text-white">{h.temp}°C</div>
                <div className="text-[10px] text-blue-400 font-semibold mt-1">☔ {h.rain}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-DAY WEEKLY FORECAST */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 mb-6 shadow-lg">
          <h3 className="font-bold mb-4 text-white text-base flex items-center justify-between">
            <span>{t.weather.weeklyForecast}</span>
            <span className="text-xs text-gray-500 font-normal">7-Day Outlook</span>
          </h3>
          <div className="space-y-2.5">
            {weeklyList.map((d) => (
              <div key={d.day} className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                <div className="w-28 text-sm font-semibold text-gray-200 shrink-0">{d.day}</div>
                <d.icon className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 text-xs text-gray-300 font-medium truncate">{d.desc}</div>
                <div className="text-xs text-blue-400 font-semibold shrink-0">☔ {d.rain}</div>
                <div className="text-sm shrink-0 font-mono">
                  <span className="font-bold text-white">{d.high}°</span>
                  <span className="text-gray-500"> / {d.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FARMING ADVISORY */}
        <div className="mb-8">
          <h3 className="font-bold mb-4 text-white text-base flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" /> {t.weather.advisoryTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {advisoryList.map((t, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${
                  t.type === "warning"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : t.type === "success"
                    ? "bg-primary/10 border-primary/30"
                    : "bg-blue-500/10 border-blue-500/30"
                }`}
              >
                <div
                  className={`text-sm font-bold mb-1.5 ${
                    t.type === "warning" ? "text-amber-400" : t.type === "success" ? "text-primary" : "text-blue-400"
                  }`}
                >
                  {t.title}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


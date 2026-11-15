import { City } from "./types";

// Every network call is in this file, so the screens never repeat fetch code.
// The API is Open-Meteo: no API key and no login.

export type CurrentWeather = {
    current: {
        temperature_2m: number;
        precipitation_probability: number;
        wind_speed_10m: number;
    };
};

type GeocodingResponse = {
    results?: {
        id: number;
        name: string;
        country?: string;
        latitude: number;
        longitude: number;
    }[];
};

export async function getCurrentWeather(
    latitude: number,
    longitude: number,
): Promise<CurrentWeather> {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation_probability,wind_speed_10m`,
    );
    // fetch only fails when there is no network. A 404 or a 500 still gives a response,
    // so we check response.ok and throw ourselves. The screen's catch shows the message.
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
}

export type HourlyRow = {
    time: string; // "2026-11-12T14:00", also the stable id of the row
    temperature: number;
    rainChance: number;
    wind: number;
};

type HourlyResponse = {
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
        wind_speed_10m: number[];
    };
};

export async function getHourlyForecast(
    latitude: number,
    longitude: number,
): Promise<HourlyRow[]> {
    // forecast_hours=24 asks for the next 24 hours. timezone=auto gives the hours of the
    // city, not the hours of the phone.
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,wind_speed_10m&forecast_hours=24&timezone=auto`,
    );
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    const body: HourlyResponse = await response.json();
    // The API sends separate lists (times, temperatures, rain, wind). We join them by
    // position into one object per hour, which is easier for the FlatList.
    return body.hourly.time.map((time, index) => ({
        time,
        temperature: body.hourly.temperature_2m[index],
        rainChance: body.hourly.precipitation_probability[index],
        wind: body.hourly.wind_speed_10m[index],
    }));
}

export async function searchCities(name: string): Promise<City[]> {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5`,
    );
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    const body: GeocodingResponse = await response.json();
    // When no city matches, the API sends no "results" at all, so we return an empty list.
    // The Search screen turns that into "City not found".
    if (!body.results) return [];
    return body.results.map((result) => ({
        id: String(result.id),
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
    }));
}

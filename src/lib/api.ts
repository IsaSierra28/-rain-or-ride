export type CurrentWeather = {
    current: {
        temperature_2m: number;
        precipitation_probability: number;
        wind_speed_10m: number;
    };
};

export async function getCurrentWeather(
    latitude: number,
    longitude: number,
): Promise<CurrentWeather> {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation_probability,wind_speed_10m`,
    );
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
}

export type Verdict = "Ride" | "Walk" | "Wait";

const MAX_RAIN = 40; // %
const MAX_WIND = 30; // km/h

export function getVerdict(rainChance: number, windSpeed: number): Verdict {
    if (rainChance > MAX_RAIN) return "Wait";
    if (windSpeed > MAX_WIND) return "Walk";
    return "Ride";
}

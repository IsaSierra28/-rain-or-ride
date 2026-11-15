// The Ride / Walk / Wait rule. Changing the two numbers below changes it everywhere.
export type Verdict = "Ride" | "Walk" | "Wait";

const MAX_RAIN = 40; // %
const MAX_WIND = 30; // km/h

// Rain is checked first, so an hour with rain and strong wind is Wait, not Walk
export function getVerdict(rainChance: number, windSpeed: number): Verdict {
    if (rainChance > MAX_RAIN) return "Wait";
    if (windSpeed > MAX_WIND) return "Walk";
    return "Ride";
}

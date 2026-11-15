import { Verdict } from "./verdict";

// Colors and shadows used by every screen, so the look can be changed in one place
export const colors = {
    background: "#f1f5fa",
    softBlue: "#e3effc",
    card: "#ffffff",
    primary: "#1e88e5",
    text: "#1b2a38",
    muted: "#5f7283",
    border: "#dbe5ee",
    danger: "#d94b4b",
};

// Soft shadow shared by the cards
export const shadow = {
    shadowColor: "#1b2a38",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
};

export const verdictMessages: Record<Verdict, string> = {
    Ride: "Good conditions to ride.",
    Walk: "Strong wind, walking is better.",
    Wait: "Rain is likely, wait it out.",
};

export const verdictColors: Record<Verdict, string> = {
    Ride: "#2e9e5b",
    Walk: "#f0a020",
    Wait: "#d94b4b",
};

// Very soft background for the Home screen, one per verdict
export const verdictTints: Record<Verdict, string> = {
    Ride: "#e9f6ee",
    Walk: "#fdf4e3",
    Wait: "#fbeaea",
};

export const verdictIcons: Record<Verdict, "bicycle" | "walk" | "rainy"> = {
    Ride: "bicycle",
    Walk: "walk",
    Wait: "rainy",
};

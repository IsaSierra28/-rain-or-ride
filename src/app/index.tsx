import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CurrentWeather, getCurrentWeather } from "../lib/api";
import { getVerdict } from "../lib/verdict";

// For now the city is fixed. The Search city screen will change it later.
const city = { name: "Montreal", latitude: 45.5, longitude: -73.6 };

export default function Home() {
    const [weather, setWeather] = useState<CurrentWeather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                setWeather(await getCurrentWeather(city.latitude, city.longitude));
            } catch {
                setError("Could not load the weather. Check your internet connection and try again.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <View style={styles.screen}>
                <ActivityIndicator size="large" />
                <Text style={styles.note}>Loading...</Text>
            </View>
        );
    }

    if (error || !weather) {
        return (
            <View style={styles.screen}>
                <Text style={styles.note}>{error}</Text>
            </View>
        );
    }

    const { temperature_2m, precipitation_probability, wind_speed_10m } = weather.current;
    const verdict = getVerdict(precipitation_probability, wind_speed_10m);

    return (
        <View style={styles.screen}>
            <Text style={styles.city}>{city.name}</Text>
            <Text style={styles.verdict}>{verdict}</Text>
            <Text style={styles.detail}>{temperature_2m} °C</Text>
            <Text style={styles.detail}>Rain chance: {precipitation_probability}%</Text>
            <Text style={styles.detail}>Wind: {wind_speed_10m} km/h</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 24,
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    city: { fontSize: 20, color: "#444" },
    verdict: { fontSize: 56, fontWeight: "bold" },
    detail: { fontSize: 16 },
    note: { color: "#666", textAlign: "center" },
});

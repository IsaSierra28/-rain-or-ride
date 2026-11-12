import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { CurrentWeather, getCurrentWeather } from "../lib/api";
import { useCities } from "../lib/cities-context";
import { getVerdict } from "../lib/verdict";

export default function Home() {
    const { selectedCity, favourites, addFavourite } = useCities();
    const [weather, setWeather] = useState<CurrentWeather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Runs every time Home comes into view, and again if the city changes
    useFocusEffect(
        useCallback(() => {
            async function load() {
                setLoading(true);
                setError("");
                try {
                    setWeather(await getCurrentWeather(selectedCity.latitude, selectedCity.longitude));
                } catch {
                    setError("Could not load the weather. Check your internet connection and try again.");
                } finally {
                    setLoading(false);
                }
            }
            load();
        }, [selectedCity]),
    );

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
                <Button title="Search another city" onPress={() => router.navigate("/search")} />
            </View>
        );
    }

    const { temperature_2m, precipitation_probability, wind_speed_10m } = weather.current;
    const verdict = getVerdict(precipitation_probability, wind_speed_10m);
    const isFavourite = favourites.some((favourite) => favourite.id === selectedCity.id);

    return (
        <View style={styles.screen}>
            <Text style={styles.city}>
                {selectedCity.name}
                {selectedCity.country ? `, ${selectedCity.country}` : ""}
            </Text>
            <Text style={styles.verdict}>{verdict}</Text>
            <Text style={styles.detail}>{temperature_2m} °C</Text>
            <Text style={styles.detail}>Rain chance: {precipitation_probability}%</Text>
            <Text style={styles.detail}>Wind: {wind_speed_10m} km/h</Text>
            {isFavourite ? (
                <Text style={styles.note}>Saved in your favourites</Text>
            ) : (
                <Button title="Add to favourites" onPress={() => addFavourite(selectedCity)} />
            )}
            <Button title="Hourly forecast" onPress={() => router.navigate("/hourly")} />
            <Button title="Search city" onPress={() => router.navigate("/search")} />
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

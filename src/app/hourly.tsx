import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { getHourlyForecast, HourlyRow } from "../lib/api";
import { useCities } from "../lib/cities-context";

export default function Hourly() {
    const { selectedCity } = useCities();
    const [rows, setRows] = useState<HourlyRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Runs every time this screen comes into view, and again if the city changes
    useFocusEffect(
        useCallback(() => {
            async function load() {
                setLoading(true);
                setError("");
                try {
                    setRows(await getHourlyForecast(selectedCity.latitude, selectedCity.longitude));
                } catch {
                    setError("Could not load the forecast. Check your internet connection and try again.");
                } finally {
                    setLoading(false);
                }
            }
            load();
        }, [selectedCity]),
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.note}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.note}>{error}</Text>
                <Button title="Back to Home" onPress={() => router.navigate("/")} />
            </View>
        );
    }

    return (
        <FlatList
            data={rows}
            keyExtractor={(item) => item.time}
            contentContainerStyle={styles.list}
            ListHeaderComponent={<Text style={styles.title}>{selectedCity.name}: next 24 hours</Text>}
            renderItem={({ item }) => (
                <View style={styles.row}>
                    <Text style={styles.time}>{item.time.slice(11, 16)}</Text>
                    <Text style={styles.value}>{item.temperature} °C</Text>
                    <Text style={styles.value}>{item.rainChance}%</Text>
                    <Text style={styles.value}>{item.wind} km/h</Text>
                </View>
            )}
            ListEmptyComponent={<Text style={styles.note}>No forecast available.</Text>}
        />
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, padding: 24, gap: 8, justifyContent: "center", alignItems: "center" },
    list: { padding: 16, gap: 8 },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#f2f6fb",
    },
    time: { fontSize: 16, fontWeight: "600", width: 60 },
    value: { fontSize: 16, flex: 1, textAlign: "right" },
    note: { color: "#666", textAlign: "center" },
});

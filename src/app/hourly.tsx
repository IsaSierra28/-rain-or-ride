import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/app-button";
import { getHourlyForecast, HourlyRow } from "../lib/api";
import { useCities } from "../lib/cities-context";
import { colors, verdictColors } from "../lib/theme";
import { getVerdict } from "../lib/verdict";

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
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.note}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.note}>{error}</Text>
                <AppButton title="Back to Home" onPress={() => router.navigate("/")} />
            </View>
        );
    }

    return (
        <FlatList
            style={styles.screen}
            data={rows}
            keyExtractor={(item) => item.time}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
                <View>
                    <Text style={styles.title}>{selectedCity.name}: next 24 hours</Text>
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerText, styles.time]}>Time</Text>
                        <Text style={styles.headerText}>Temp</Text>
                        <Text style={styles.headerText}>Rain</Text>
                        <Text style={styles.headerText}>Wind</Text>
                    </View>
                </View>
            }
            renderItem={({ item }) => {
                const verdict = getVerdict(item.rainChance, item.wind);
                return (
                    <View style={[styles.row, { borderLeftColor: verdictColors[verdict] }]}>
                        <Text style={[styles.value, styles.time]}>{item.time.slice(11, 16)}</Text>
                        <Text style={styles.value}>{item.temperature} °C</Text>
                        <Text style={styles.value}>{item.rainChance}%</Text>
                        <Text style={styles.value}>{item.wind} km/h</Text>
                    </View>
                );
            }}
            ListEmptyComponent={<Text style={styles.note}>No forecast available.</Text>}
        />
    );
}

const styles = StyleSheet.create({
    screen: { backgroundColor: colors.background },
    center: {
        flex: 1,
        padding: 24,
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    list: { padding: 16, gap: 8 },
    title: { fontSize: 20, fontWeight: "600", color: colors.text, marginBottom: 12 },
    headerRow: { flexDirection: "row", paddingHorizontal: 16, paddingBottom: 4 },
    headerText: { flex: 1, textAlign: "right", fontSize: 12, color: colors.muted },
    row: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: colors.card,
        borderLeftWidth: 6,
    },
    time: { textAlign: "left", fontWeight: "600" },
    value: { flex: 1, fontSize: 16, textAlign: "right", color: colors.text },
    note: { color: colors.muted, textAlign: "center" },
});

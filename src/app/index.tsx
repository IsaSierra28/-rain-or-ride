import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "../components/app-button";
import { CityPhoto } from "../components/city-photo";
import { CurrentWeather, getCurrentWeather } from "../lib/api";
import { useCities } from "../lib/cities-context";
import {
    colors,
    shadow,
    verdictColors,
    verdictIcons,
    verdictMessages,
    verdictTints,
} from "../lib/theme";
import { getVerdict } from "../lib/verdict";

export default function Home() {
    const { selectedCity, favourites, addFavourite, removeFavourite } = useCities();
    const insets = useSafeAreaInsets();
    const [weather, setWeather] = useState<CurrentWeather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // useFocusEffect runs every time Home comes into view. A normal useEffect would only
    // run when the city changes, because tabs stay mounted. useCallback keeps the same
    // function between renders, so the effect does not restart by itself.
    useFocusEffect(
        useCallback(() => {
            // The function given to an effect cannot be async, so the async work is in load()
            async function load() {
                setLoading(true);
                setError("");
                try {
                    setWeather(await getCurrentWeather(selectedCity.latitude, selectedCity.longitude));
                } catch {
                    setError("Could not load the weather. Check your internet connection and try again.");
                } finally {
                    // finally always runs, so the spinner stops even when there is an error
                    setLoading(false);
                }
            }
            load();
        }, [selectedCity]),
    );

    // Three possible screens: loading, error, and the real result below
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.note}>Loading...</Text>
            </View>
        );
    }

    if (error || !weather) {
        return (
            <View style={styles.center}>
                <Ionicons name="cloud-offline" size={48} color={colors.muted} />
                <Text style={styles.note}>{error}</Text>
                <AppButton title="Search another city" onPress={() => router.navigate("/search")} />
            </View>
        );
    }

    const { temperature_2m, precipitation_probability, wind_speed_10m } = weather.current;
    // The rule is in verdict.ts. Here we only show its answer: Ride, Walk or Wait
    const verdict = getVerdict(precipitation_probability, wind_speed_10m);
    // The saved copy of this city (it may have the user's own photo), or undefined
    const favourite = favourites.find((saved) => saved.id === selectedCity.id);
    const isFavourite = favourite !== undefined;

    return (
        <ScrollView
            style={{ backgroundColor: verdictTints[verdict] }}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        >
            <View style={styles.header}>
                <CityPhoto city={favourite ?? selectedCity} style={styles.avatar} iconSize={28} />
                <View style={styles.headerText}>
                    <Text style={styles.city} numberOfLines={1}>
                        {selectedCity.name}
                    </Text>
                    {selectedCity.country ? (
                        <Text style={styles.country}>{selectedCity.country}</Text>
                    ) : null}
                </View>
            </View>

            <View style={[styles.verdictCard, { backgroundColor: verdictColors[verdict] }]}>
                <Pressable
                    style={styles.heart}
                    onPress={() =>
                        isFavourite ? removeFavourite(selectedCity.id) : addFavourite(selectedCity)
                    }
                >
                    <Ionicons
                        name={isFavourite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavourite ? "#ff5a78" : "#fff"}
                    />
                </Pressable>
                <Ionicons name={verdictIcons[verdict]} size={72} color="#fff" />
                <Text style={styles.verdict}>{verdict}</Text>
                <Text style={styles.message}>{verdictMessages[verdict]}</Text>
            </View>

            <View style={styles.stats}>
                <View style={styles.stat}>
                    <View style={styles.statIcon}>
                        <Ionicons name="thermometer" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.statValue}>{temperature_2m} °C</Text>
                    <Text style={styles.statLabel}>Temperature</Text>
                </View>
                <View style={styles.stat}>
                    <View style={styles.statIcon}>
                        <Ionicons name="water" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.statValue}>{precipitation_probability}%</Text>
                    <Text style={styles.statLabel}>Rain chance</Text>
                </View>
                <View style={styles.stat}>
                    <View style={styles.statIcon}>
                        <Ionicons name="flag" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.statValue}>{wind_speed_10m} km/h</Text>
                    <Text style={styles.statLabel}>Wind</Text>
                </View>
            </View>

            <View style={styles.buttons}>
                <AppButton title="Hourly forecast" onPress={() => router.navigate("/hourly")} />
                <AppButton
                    title="Search city"
                    variant="outline"
                    onPress={() => router.navigate("/search")}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // flexGrow lets the verdict card take the space that is left on tall screens
    content: { flexGrow: 1, padding: 20, gap: 16 },
    center: {
        flex: 1,
        padding: 24,
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    header: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatar: { width: 60, height: 60, borderRadius: 30, ...shadow },
    headerText: { flex: 1 },
    city: { fontSize: 28, fontWeight: "800", color: colors.text },
    country: { fontSize: 15, color: colors.muted },
    buttons: { gap: 10 },
    verdictCard: {
        flex: 1,
        minHeight: 240,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: 24,
        ...shadow,
    },
    heart: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    verdict: { fontSize: 64, fontWeight: "800", color: "#fff" },
    message: { fontSize: 17, color: "#ffffffe6", textAlign: "center" },
    stats: { flexDirection: "row", gap: 10 },
    stat: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 22,
        paddingVertical: 14,
        alignItems: "center",
        gap: 4,
        ...shadow,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.softBlue,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    statValue: { fontSize: 17, fontWeight: "700", color: colors.text },
    statLabel: { fontSize: 12, color: colors.muted },
    note: { color: colors.muted, textAlign: "center" },
});

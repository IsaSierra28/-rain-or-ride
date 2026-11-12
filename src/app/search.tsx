import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "../components/app-button";
import { searchCities } from "../lib/api";
import { useCities } from "../lib/cities-context";
import { colors } from "../lib/theme";
import { City } from "../lib/types";

export default function SearchCity() {
    const { setSelectedCity } = useCities();
    const [name, setName] = useState("");
    const [results, setResults] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch() {
        if (!name.trim()) {
            setError("Type a city name.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const found = await searchCities(name.trim());
            setResults(found);
            if (found.length === 0) {
                setError("City not found. Check the spelling and try again.");
            }
        } catch {
            setError("Could not search. Check your internet connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    function chooseCity(city: City) {
        setSelectedCity(city);
        setName("");
        setResults([]);
        router.navigate("/");
    }

    return (
        <View style={styles.screen}>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="City name"
                placeholderTextColor={colors.muted}
                style={[styles.input, error ? styles.inputError : null]}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <AppButton title="Search" onPress={handleSearch} />
            {loading && <ActivityIndicator color={colors.primary} />}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Pressable
                        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                        onPress={() => chooseCity(item)}
                    >
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.country}>{item.country}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 20, gap: 12, backgroundColor: colors.background },
    input: {
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: colors.text,
    },
    inputError: { borderColor: colors.danger },
    error: { color: colors.danger },
    list: { gap: 10, paddingTop: 4 },
    row: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    pressed: { opacity: 0.7 },
    name: { fontSize: 18, fontWeight: "600", color: colors.text },
    country: { color: colors.muted },
});

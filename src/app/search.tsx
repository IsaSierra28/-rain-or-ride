import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Button,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { searchCities } from "../lib/api";
import { useCities } from "../lib/cities-context";
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
                style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Search" onPress={handleSearch} />
            {loading && <ActivityIndicator />}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Pressable style={styles.row} onPress={() => chooseCity(item)}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.country}>{item.country}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16, gap: 12 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    error: { color: "#c62828" },
    list: { gap: 8 },
    row: { padding: 16, borderRadius: 12, backgroundColor: "#f2f6fb" },
    name: { fontSize: 18, fontWeight: "600" },
    country: { color: "#666" },
});

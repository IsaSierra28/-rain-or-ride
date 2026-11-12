import { router } from "expo-router";
import { Button, FlatList, Pressable, StyleSheet, Text } from "react-native";
import { useCities } from "../lib/cities-context";
import { City } from "../lib/types";

export default function Favourites() {
    const { favourites, removeFavourite, setSelectedCity } = useCities();

    function openCity(city: City) {
        setSelectedCity(city);
        router.navigate("/");
    }

    return (
        <FlatList
            data={favourites}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
                <Pressable style={styles.row} onPress={() => openCity(item)}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Button title="Remove" onPress={() => removeFavourite(item.id)} />
                </Pressable>
            )}
            ListEmptyComponent={
                <Text style={styles.empty}>No favourite cities yet.</Text>
            }
        />
    );
}

const styles = StyleSheet.create({
    list: { padding: 16, gap: 12 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#f2f6fb",
    },
    name: { fontSize: 18, fontWeight: "600" },
    empty: { color: "#666", textAlign: "center", marginTop: 24 },
});

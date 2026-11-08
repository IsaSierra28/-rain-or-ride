import { StyleSheet, Text, View } from "react-native";

export default function Favourites() {
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Favourites</Text>
            <Text style={styles.note}>No favourite cities yet.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    title: { fontSize: 24, fontWeight: "bold" },
    note: { color: "#666" },
});

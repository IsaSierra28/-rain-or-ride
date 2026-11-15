import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { CityPhoto } from "../components/city-photo";
import { useCities } from "../lib/cities-context";
import { colors } from "../lib/theme";
import { City } from "../lib/types";

export default function Favourites() {
    const { favourites, removeFavourite, setSelectedCity, setPhoto } = useCities();

    function openCity(city: City) {
        setSelectedCity(city);
        router.navigate("/");
    }

    // Camera steps: 1) ask for permission, 2) open the camera, 3) check the user did not
    // cancel, 4) save the uri. The uri is the path of the picture on the phone (a string).
    async function takePhoto(cityId: string) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                "Camera not allowed",
                "Rain or Ride needs the camera to take a photo. You can allow it in your phone's settings.",
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        if (!result.canceled) {
            setPhoto(cityId, result.assets[0].uri);
        }
    }

    // Same idea as takePhoto, but the picture comes from the gallery
    async function pickPhoto(cityId: string) {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] });
        if (!result.canceled) {
            setPhoto(cityId, result.assets[0].uri);
        }
    }

    function choosePhoto(cityId: string) {
        Alert.alert("Add your own photo", "It replaces the automatic photo of the city.", [
            { text: "Take a photo", onPress: () => takePhoto(cityId) },
            { text: "Choose from gallery", onPress: () => pickPhoto(cityId) },
            { text: "Cancel", style: "cancel" },
        ]);
    }

    return (
        <FlatList
            style={styles.screen}
            data={favourites}
            // The city id is unique, so it is the key of each card
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
                <Pressable
                    style={({ pressed }) => pressed && styles.pressed}
                    onPress={() => openCity(item)}
                >
                    <CityPhoto city={item} style={styles.card}>
                        <View style={styles.actions}>
                            <Pressable onPress={() => choosePhoto(item.id)} hitSlop={8}>
                                <Ionicons name="camera" size={22} color="#fff" />
                            </Pressable>
                            {item.photoUri && (
                                <Pressable onPress={() => setPhoto(item.id, undefined)} hitSlop={8}>
                                    <Ionicons name="close-circle" size={22} color="#fff" />
                                </Pressable>
                            )}
                            <Pressable onPress={() => removeFavourite(item.id)} hitSlop={8}>
                                <Ionicons name="trash" size={22} color="#ffb3b3" />
                            </Pressable>
                        </View>
                        <View style={styles.caption}>
                            <Text style={styles.name}>{item.name}</Text>
                            {item.country ? <Text style={styles.country}>{item.country}</Text> : null}
                        </View>
                    </CityPhoto>
                </Pressable>
            )}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Ionicons name="star-outline" size={48} color={colors.muted} />
                    <Text style={styles.emptyText}>No favourite cities yet.</Text>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    screen: { backgroundColor: colors.background },
    list: { padding: 20, gap: 14 },
    pressed: { opacity: 0.8 },
    card: { height: 170, borderRadius: 20, justifyContent: "space-between", padding: 14 },
    actions: {
        flexDirection: "row",
        gap: 14,
        alignSelf: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    caption: { gap: 0 },
    name: { fontSize: 24, fontWeight: "700", color: "#fff" },
    country: { color: "#ffffffcc", fontSize: 14 },
    empty: { alignItems: "center", gap: 8, marginTop: 48 },
    emptyText: { color: colors.muted },
});

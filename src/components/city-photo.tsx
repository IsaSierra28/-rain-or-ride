import Ionicons from "@expo/vector-icons/Ionicons";
import { ReactNode, useEffect, useState } from "react";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { City } from "../lib/types";

type Props = {
    city: City;
    style?: StyleProp<ViewStyle>;
    children?: ReactNode; // drawn on top of the photo
    iconSize?: number; // size of the weather icon shown when there is no photo
};

// Soft colours for when a photo is not available
const fallbackColors = ["#5b9bd5", "#4fb3bf", "#7e8fd6", "#6aa5c8", "#5aa6a0", "#8a9fd4"];

// The same city always gets the same colour
function colorFor(id: string) {
    let sum = 0;
    for (const letter of id) sum += letter.charCodeAt(0);
    return fallbackColors[sum % fallbackColors.length];
}

// The user's own photo wins; otherwise a random photo from picsum.photos.
// The city id is the seed, so each city keeps the same photo every time.
// If the photo cannot load, a soft colour with a weather icon is shown instead.
export function CityPhoto({ city, style, children, iconSize = 56 }: Props) {
    const uri = city.photoUri ?? `https://picsum.photos/seed/${city.id}/600/300`;
    const [failed, setFailed] = useState(false);

    // A new photo gets a new chance to load
    useEffect(() => {
        setFailed(false);
    }, [uri]);

    return (
        <View style={[styles.box, { backgroundColor: colorFor(city.id) }, style]}>
            {failed ? (
                <View style={[styles.fill, styles.fallback]}>
                    <Ionicons name="partly-sunny" size={iconSize} color="#ffffffcc" />
                </View>
            ) : (
                <Image
                    source={{ uri }}
                    style={styles.fill}
                    onError={(event) => {
                        // log, not warn: a warning shows a yellow box on the screen
                        console.log("Photo failed to load:", uri, event.nativeEvent.error);
                        setFailed(true);
                    }}
                />
            )}
            <View style={styles.shade} />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    box: { overflow: "hidden" },
    fill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
    fallback: { alignItems: "center", justifyContent: "center" },
    shade: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
});

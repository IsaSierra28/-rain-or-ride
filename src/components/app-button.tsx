import { Pressable, StyleSheet, Text } from "react-native";
import { colors, shadow } from "../lib/theme";

type Props = {
    title: string;
    onPress: () => void;
    variant?: "primary" | "outline";
};

export function AppButton({ title, onPress, variant = "primary" }: Props) {
    const outline = variant === "outline";
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                outline ? styles.outline : styles.primary,
                pressed && styles.pressed,
            ]}
        >
            <Text style={[styles.text, outline && styles.outlineText]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 18,
        alignItems: "center",
        alignSelf: "stretch",
    },
    primary: { backgroundColor: colors.primary, ...shadow, shadowColor: colors.primary },
    outline: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.primary },
    pressed: { opacity: 0.75 },
    text: { color: "#fff", fontSize: 16, fontWeight: "700" },
    outlineText: { color: colors.primary },
});

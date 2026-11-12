import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Tabs } from "expo-router/js-tabs";
import { Pressable } from "react-native";
import { CitiesProvider } from "../lib/cities-context";

// Back arrow for the screens that are not tabs (Search city, Hourly forecast)
function backArrow() {
    return (
        <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
            <Ionicons name="arrow-back" size={24} color="#1e88e5" />
        </Pressable>
    );
}

export default function TabLayout() {
    return (
        <CitiesProvider>
            <Tabs screenOptions={{ tabBarActiveTintColor: "#1e88e5" }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="bicycle" color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="favourites"
                    options={{
                        title: "Favourites",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="star" color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{ href: null, title: "Search city", headerLeft: backArrow }}
                />
                <Tabs.Screen
                    name="hourly"
                    options={{ href: null, title: "Hourly forecast", headerLeft: backArrow }}
                />
            </Tabs>
        </CitiesProvider>
    );
}

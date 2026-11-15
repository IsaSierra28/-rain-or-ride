import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Tabs } from "expo-router/js-tabs";
import { Pressable } from "react-native";
import { CitiesProvider } from "../lib/cities-context";
import { colors } from "../lib/theme";

// Back arrow for the screens that are not tabs (Search city, Hourly forecast)
function backArrow() {
    return (
        <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
    );
}

// _layout.tsx is the frame of the app: it is not a screen. Every file in src/app is a
// screen (index = Home, favourites, search, hourly). Nothing needs to be registered.
export default function TabLayout() {
    return (
        // The provider goes above the tabs, so every screen can use useCities()
        <CitiesProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.primary,
                    headerTintColor: colors.text,
                    headerTitleStyle: { fontWeight: "700" },
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: colors.background },
                    sceneStyle: { backgroundColor: colors.background },
                    tabBarStyle: { backgroundColor: colors.card, borderTopWidth: 0, elevation: 12 },
                    tabBarLabelStyle: { fontWeight: "600" },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        headerShown: false,
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
                {/* href: null hides these two from the tab bar, but the routes still work.
                    They open from Home and have a back arrow (the pattern from the course) */}
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

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { deleteFavourite, loadFavourites, saveFavourite, saveFavouritePhoto } from "./storage";
import { City } from "./types";

type CitiesValue = {
    selectedCity: City;
    setSelectedCity: (city: City) => void;
    favourites: City[];
    addFavourite: (city: City) => Promise<void>;
    removeFavourite: (id: string) => Promise<void>;
    setPhoto: (id: string, photoUri?: string) => Promise<void>;
};

// A context shares data with every screen without passing props from screen to screen.
// The provider below holds the data; any screen reads it with the useCities() hook.
const CitiesContext = createContext<CitiesValue | null>(null);

// The city shown the first time the app opens
const startingCity: City = {
    id: "montreal",
    name: "Montreal",
    country: "Canada",
    latitude: 45.5,
    longitude: -73.6,
};

// _layout.tsx wraps the tabs in this provider, so every screen sees the same selected
// city and the same favourites. State inside one screen would be private to that screen.
export function CitiesProvider({ children }: { children: ReactNode }) {
    const [selectedCity, setSelectedCity] = useState<City>(startingCity);
    const [favourites, setFavourites] = useState<City[]>([]);

    // Load the saved favourites from SQLite on mount
    useEffect(() => {
        async function load() {
            try {
                setFavourites(await loadFavourites());
            } catch {
                setFavourites([]);
            }
        }
        load();
    }, []);

    // Each change is written to the database, then the state is updated
    async function addFavourite(city: City) {
        await saveFavourite(city);
        // (current) => ... uses the latest list, even if two changes happen very close together
        setFavourites((current) => [...current, city]);
    }

    async function removeFavourite(id: string) {
        await deleteFavourite(id);
        setFavourites((current) => current.filter((city) => city.id !== id));
    }

    // Leaving out photoUri takes the photo off
    async function setPhoto(id: string, photoUri?: string) {
        await saveFavouritePhoto(id, photoUri);
        setFavourites((current) =>
            current.map((city) => (city.id === id ? { ...city, photoUri } : city)),
        );
    }

    return (
        <CitiesContext.Provider
            value={{
                selectedCity,
                setSelectedCity,
                favourites,
                addFavourite,
                removeFavourite,
                setPhoto,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

// The hook every screen uses. It throws a clear error if a screen is outside the provider.
export function useCities() {
    const value = useContext(CitiesContext);
    if (!value) throw new Error("useCities must be used inside CitiesProvider");
    return value;
}

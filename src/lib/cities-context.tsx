import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { deleteFavourite, loadFavourites, saveFavourite } from "./storage";
import { City } from "./types";

type CitiesValue = {
    selectedCity: City;
    setSelectedCity: (city: City) => void;
    favourites: City[];
    addFavourite: (city: City) => Promise<void>;
    removeFavourite: (id: string) => Promise<void>;
};

const CitiesContext = createContext<CitiesValue | null>(null);

const startingCity: City = {
    id: "montreal",
    name: "Montreal",
    country: "Canada",
    latitude: 45.5,
    longitude: -73.6,
};

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
        setFavourites((current) => [...current, city]);
    }

    async function removeFavourite(id: string) {
        await deleteFavourite(id);
        setFavourites((current) => current.filter((city) => city.id !== id));
    }

    return (
        <CitiesContext.Provider
            value={{ selectedCity, setSelectedCity, favourites, addFavourite, removeFavourite }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

export function useCities() {
    const value = useContext(CitiesContext);
    if (!value) throw new Error("useCities must be used inside CitiesProvider");
    return value;
}

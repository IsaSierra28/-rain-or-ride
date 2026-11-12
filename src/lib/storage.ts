import * as SQLite from "expo-sqlite";
import { City } from "./types";

type FavouriteRow = {
    id: string;
    name: string;
    country: string | null;
    latitude: number;
    longitude: number;
};

// Open the database once and create the table the first time
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb() {
    if (!dbPromise) {
        dbPromise = (async () => {
            const db = await SQLite.openDatabaseAsync("rainorride.db");
            await db.execAsync(`CREATE TABLE IF NOT EXISTS favourites (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                country TEXT,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL
            );`);
            return db;
        })();
    }
    return dbPromise;
}

export async function loadFavourites(): Promise<City[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<FavouriteRow>("SELECT * FROM favourites ORDER BY rowid");
    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        country: row.country ?? undefined,
        latitude: row.latitude,
        longitude: row.longitude,
    }));
}

export async function saveFavourite(city: City) {
    const db = await getDb();
    await db.runAsync(
        "INSERT OR IGNORE INTO favourites (id, name, country, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
        city.id,
        city.name,
        city.country ?? null,
        city.latitude,
        city.longitude,
    );
}

export async function deleteFavourite(id: string) {
    const db = await getDb();
    await db.runAsync("DELETE FROM favourites WHERE id = ?", id);
}

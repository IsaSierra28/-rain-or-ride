import * as SQLite from "expo-sqlite";
import { FavouriteRow, rowsToCities } from "./parsing";
import { City } from "./types";

// All the SQLite code is in this file: the screens never write SQL.

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
                longitude REAL NOT NULL,
                photo_uri TEXT
            );`);
            // A table made before photos existed has no photo_uri column yet
            const columns = await db.getAllAsync<{ name: string }>("PRAGMA table_info(favourites)");
            if (!columns.some((column) => column.name === "photo_uri")) {
                await db.execAsync("ALTER TABLE favourites ADD COLUMN photo_uri TEXT;");
            }
            return db;
        })();
    }
    return dbPromise;
}

// Reads every saved city. ORDER BY rowid keeps the order in which they were saved.
export async function loadFavourites(): Promise<City[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<FavouriteRow>("SELECT * FROM favourites ORDER BY rowid");
    // This file has to touch the device. Turning the rows into cities does not,
    // so that half lives in parsing.ts, where a test can reach it.
    return rowsToCities(rows);
}

// The ? are placeholders: the values are sent separately, so user input cannot change the SQL.
// INSERT OR IGNORE skips the city if its id already exists, so there are no duplicates.
export async function saveFavourite(city: City) {
    const db = await getDb();
    await db.runAsync(
        "INSERT OR IGNORE INTO favourites (id, name, country, latitude, longitude, photo_uri) VALUES (?, ?, ?, ?, ?, ?)",
        city.id,
        city.name,
        city.country ?? null,
        city.latitude,
        city.longitude,
        city.photoUri ?? null,
    );
}

// photoUri is the path of a picture on the phone (a string). Passing undefined saves null,
// which removes the photo.
export async function saveFavouritePhoto(id: string, photoUri?: string) {
    const db = await getDb();
    await db.runAsync("UPDATE favourites SET photo_uri = ? WHERE id = ?", photoUri ?? null, id);
}

export async function deleteFavourite(id: string) {
    const db = await getDb();
    await db.runAsync("DELETE FROM favourites WHERE id = ?", id);
}

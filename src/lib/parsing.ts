import { City } from "./types";

// One row of the favourites table, as SQLite returns it (empty values come back as null)
export type FavouriteRow = {
    id: string;
    name: string;
    country: string | null;
    latitude: number;
    longitude: number;
    photo_uri: string | null;
};

// What the rows mean. No SQLite here, so a test can call it without a phone.
// storage.ts keeps only the part that touches the device.
export function rowsToCities(rows: FavouriteRow[]): City[] {
    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        // SQLite gives null for an empty column, but City uses undefined for "missing".
        // A city saved before photos existed has photo_uri = null.
        country: row.country ?? undefined,
        latitude: row.latitude,
        longitude: row.longitude,
        photoUri: row.photo_uri ?? undefined,
    }));
}

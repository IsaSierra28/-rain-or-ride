import { FavouriteRow, rowsToCities } from "./parsing";

const bogotaRow: FavouriteRow = {
    id: "3688689",
    name: "Bogotá",
    country: "Colombia",
    latitude: 4.6,
    longitude: -74.08,
    photo_uri: "file:///bogota.jpg",
};

describe("rowsToCities", () => {
    it("turns a saved row into a city", () => {
        expect(rowsToCities([bogotaRow])).toEqual([
            {
                id: "3688689",
                name: "Bogotá",
                country: "Colombia",
                latitude: 4.6,
                longitude: -74.08,
                photoUri: "file:///bogota.jpg",
            },
        ]);
    });

    it("returns an empty list when nothing is saved", () => {
        expect(rowsToCities([])).toEqual([]);
    });

    it("turns null columns into missing values (a city saved before photos existed)", () => {
        const [city] = rowsToCities([{ ...bogotaRow, country: null, photo_uri: null }]);
        expect(city.photoUri).toBeUndefined();
        expect(city.country).toBeUndefined();
    });
});

// A city, as it comes from the search and as it is saved in the favourites table
export type City = {
    id: string;
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
    photoUri?: string; // optional: favourites saved before photos have none
};

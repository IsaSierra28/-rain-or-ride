export type City = {
    id: string;
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
    photoUri?: string; // optional: favourites saved before photos have none
};

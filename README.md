# Rain or Ride

A mobile app that answers one question: **should I ride or walk right now?**

It is for people who get around the city by bike or on foot and have to choose every day. The app reads the live weather for a city and gives one verdict: Ride, Walk or Wait.

Built with Expo, React Native, TypeScript and Expo Router for Application Development 2 (Mobile).

## Screens

- **Home** - the verdict for the selected city, with the temperature, rain chance and wind. It reloads every time you open it. The background color follows the verdict, and the heart button saves or removes the city from your favourites.
- **Hourly forecast** - the next 24 hours in a list: time, temperature, rain chance and wind. Each row has a color bar with the verdict for that hour.
- **Search city** - a form with validation (empty input, city not found, no connection). Tap a result to make it the selected city.
- **Favourites** - the saved cities as photo cards. Tap one to open it on Home. You can add your own photo (camera or gallery) or delete the city.

## The verdict rule

- **Wait** when the rain chance is above 40%
- **Walk** when the wind is above 30 km/h
- **Ride** otherwise

## APIs

No API key and no login for any of them:

- [Open-Meteo](https://open-meteo.com) forecast: `https://api.open-meteo.com/v1/forecast` (current weather and hourly forecast)
- [Open-Meteo](https://open-meteo.com) geocoding: `https://geocoding-api.open-meteo.com/v1/search` (city search)
- [Picsum Photos](https://picsum.photos): a random photo for each city. If it cannot load, the app shows a soft color with a weather icon instead.

Every screen that loads data shows a loading state and an error message.

## Local storage

Favourite cities, and the photo you add to each one, are saved on the device with `expo-sqlite`, so they are still there after the app is closed. There is no server.

## Device capability

The camera and the photo gallery, with `expo-image-picker`. The app asks for the camera permission first and shows a message if it is refused.

## Project structure

```
src/app/         screens (Expo Router): index, hourly, search, favourites
src/components/  app-button.tsx, city-photo.tsx
src/lib/         api.ts (fetch), storage.ts (SQLite), cities-context.tsx (selected city and favourites),
                 verdict.ts, theme.ts, types.ts
```

## Run it

```
npm install
npx expo start
```

Then press `a` for the Android emulator, or scan the QR code with Expo Go on your phone.

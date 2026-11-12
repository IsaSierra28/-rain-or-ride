# Rain or Ride

A mobile app that answers one question: **should I ride or walk right now?**

It is for people who get around the city by bike or on foot and have to choose every day. The app reads the live weather for a city and gives one verdict: Ride, Walk or Wait.

Built with Expo, React Native, TypeScript and Expo Router for Application Development 2 (Mobile).

## Screens

- **Home** - the verdict for the selected city, with the temperature, rain chance and wind. It reloads every time you open it.
- **Hourly forecast** - the next 24 hours in a list: time, temperature, rain chance and wind.
- **Search city** - a form with validation (empty input, city not found, no connection). Tap a result to make it the selected city.
- **Favourites** - the saved cities. Tap one to open it on Home, or remove it.

## The verdict rule

- **Wait** when the rain chance is above 40%
- **Walk** when the wind is above 30 km/h
- **Ride** otherwise

## API

[Open-Meteo](https://open-meteo.com). No API key and no login:

- Forecast: `https://api.open-meteo.com/v1/forecast` (current weather and hourly forecast)
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search` (city search)

Every screen that loads data shows a loading state and an error message.

## Local storage

Favourite cities are saved on the device with `expo-sqlite`, so they are still there after the app is closed. There is no server.

## Project structure

```
src/app/        screens (Expo Router): index, hourly, search, favourites
src/lib/        api.ts (fetch), storage.ts (SQLite), cities-context.tsx (selected city and favourites), verdict.ts, types.ts
```

## Run it

```
npm install
npx expo start
```

Then press `a` for the Android emulator, or scan the QR code with Expo Go on your phone.

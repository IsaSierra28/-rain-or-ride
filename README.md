# Rain or Ride

A mobile app that answers one question: **should I ride or walk right now?**

Built with Expo and React Native for Application Development 2 (Mobile).

## What works so far

- Two tabs: Home and Favourites
- Home loads the current weather from Open-Meteo for Montreal and shows the verdict
- Loading and error states on Home

## The verdict rule

- **Wait** when the rain chance is above 40%
- **Walk** when the wind is above 30 km/h
- **Ride** otherwise

## Next

- Search city (form with validation, Open-Meteo geocoding)
- Hourly forecast in a FlatList
- Favourite cities saved on the device

## Run it

```
npm install
npx expo start
```

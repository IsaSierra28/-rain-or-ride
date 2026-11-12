# Lessons learned: Rain or Ride

These are five problems I actually hit while building Rain or Ride (Expo, React Native, TypeScript, Expo Router, Open-Meteo, SQLite). For each one I write what went wrong, what I tried, how I fixed it and how I know it is fixed, and what I would do differently.

## 1. The city photos never showed up

**What went wrong.** I wanted every city to have a photo on Home and on the Favourites cards. After I added the photo component, the cards stayed a flat blue box. There was no photo, no error on the screen and nothing in the terminal, so I had no clue what was failing.

**What I tried.**
- First I used the Wikipedia summary API (`/api/rest_v1/page/summary/<city>`), which returns a thumbnail and needs no key. I tested it from the command line with Montreal, Bogotá, Medellín, Cali, Paris, Toronto and Barranquilla, and all of them returned a photo. I also handled the cases I found: "Springfield" returns a disambiguation page, and a missing article returns 404. In the emulator it still showed only blue, and my code had an empty `catch`, so the failure was invisible.
- I tried asking Wikimedia for a bigger thumbnail by editing the size in the URL. The server answered with an error, so I dropped that idea and kept the size the API gives.
- Then I copied what I did in Wanderlist: a random photo from `picsum.photos` with `<Image source={{ uri }} />`. I used the city id as a seed so each city keeps the same photo. It was still blue.
- I could not tell if the bug was in my code or in the service, so I added an `onError` handler on the `Image` that prints the URL and the error.

**How I fixed it, and how I know.** The emulator log finally said: `Photo failed to load: https://picsum.photos/seed/montreal/600/300 ... Unexpected HTTP code ... code=522`. A 522 means the Picsum server did not answer, and from my computer the same URL also timed out. So the bug was not in my code: the service was down. I could not fix the service, so I fixed how the app behaves when it fails. `CityPhoto` now keeps a `failed` state: when the image fails, it shows a soft color (always the same one for the same city, taken from the city id) with a weather icon. I also let the user add their own photo from the camera or the gallery, saved in SQLite, which does not depend on any website. I know it works because the Home avatar showed the weather icon after the 522 appeared in the log. I also noticed that `console.warn` opens a yellow box on the screen in Expo Go, so I changed it to `console.log`.

**What I would do differently.** I would design the "image failed" state at the same time as the image, and I would never leave a `catch` empty. I would also add the `onError` log from the start. Before that, I should have tested whether the Wikipedia version failed in the emulator for the same reason, because I never found out why it did.

## 2. The editor said `/hourly` was not a valid route

**What went wrong.** After I added the Hourly forecast screen and a button in Home with `router.navigate("/hourly")`, the editor showed an error: `Argument of type '"/hourly"' is not assignable to parameter of type 'RelativePathString | ExternalPathString | "/favourites" ...'`. In the same file I had also used `router` in `hourly.tsx` without importing it.

**What I tried.** At first I thought the route was wrong. Then I opened `.expo/types/router.d.ts` and found that Expo had already regenerated the typed routes, and `/hourly` was in the list. So the editor message was old.

**How I fixed it, and how I know.** I added the missing `import { router } from "expo-router"` and ran `npx tsc --noEmit`, which returned no errors. The same thing happened several times later: the editor reported "Cannot find name" or "declared but never used" in the middle of a change, before my import edit was applied, and the typecheck was clean.

**What I would do differently.** I would not trust the red underline right after an edit. I would run `npx tsc --noEmit` first, and I would read the whole message to see if it says which file or type is stale.

## 3. "The app crashed", Ctrl+C did nothing, and reloading changed nothing

**What went wrong.** After the design changes the app crashed on the emulator. I tried to restart Expo, but `Ctrl+C` did not stop it. Later, pressing reload did not show my changes either: the screen kept showing the old design.

**What I tried.** I pressed `Ctrl+C` again, and I tried reloading the app. I never found out why `Ctrl+C` was ignored. When I looked at what was running, the Pixel 10 emulator was on, but there was no Expo server listening on port 8081. That explained everything: there was nothing to reload, and the app was showing an old bundle that was already loaded.

**How I fixed it, and how I know.** I started `npx expo start` again. My first attempt used `CI=1`, which turns off reloads when I edit files, so I stopped it. The stopped process left a copy of Expo alive on port 8081, so the next start failed with `Port 8081 is being used by another process` and `Input is required, but 'npx expo' is in non-interactive mode`. I checked the command line of the process that held the port, saw it was my own old `expo start`, and closed only that one. After that Expo started, the app downloaded the bundle, and the new design appeared. Sometimes hot reload was slow, so I also reopened the app with `adb shell am start -a android.intent.action.VIEW -d exp://10.0.2.2:8081`.

**What I would do differently.** When the screen does not change, I would first check whether the dev server is running at all, and which process owns port 8081, before touching the code. I would also start the dev server in a normal terminal and not in CI mode.

## 4. The Expo Go tools button covered my buttons

**What went wrong.** On Home I put a heart button and a search button in the top right corner. In the emulator, a round grey gear button was always on top of them, so the heart or the search icon was hidden.

**What I tried.** I moved the buttons around more than once: the heart at the top right of the city card, then at the right end of the header, and the search icon next to it. Each time one of them ended up under the gear, because the gear always stays at the top right. I took a screenshot after every change instead of trusting the layout in my head.

**How I fixed it, and how I know.** The gear is the Expo Go developer tools button, not part of my app. I kept the top right corner free: the heart moved into the corner of the verdict card, and "Search city" became a normal button at the bottom, next to "Hourly forecast". The last screenshot showed the gear alone in the corner and nothing hidden under it.

**What I would do differently.** I would look at my screens in the emulator while I design them, not only run the typecheck, and I would keep the top right corner empty in a development build.

## 5. `StyleSheet.absoluteFillObject` no longer exists

**What went wrong.** In `CityPhoto` I used `...StyleSheet.absoluteFillObject` to make the photo and the dark layer fill their box. The typecheck failed: `Property 'absoluteFillObject' does not exist on type 'typeof StyleSheet'. Did you mean 'absoluteFill'?`

**What I tried.** The message suggested `absoluteFill`, but `absoluteFill` is a registered style and I wanted to spread the style into other objects. I also remembered that `absoluteFillObject` used to work. It was removed in this version of React Native: Expo and React Native change between versions, and my memory of an API can be old.

**How I fixed it, and how I know.** I wrote the style by hand: `{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }`. `npx tsc --noEmit` returned no errors and the photo layers rendered correctly in the emulator.

**What I would do differently.** Before I use a React Native or Expo API from memory, I would check the docs for the SDK version in `package.json` (here SDK 57 and React Native 0.86), because Expo changes APIs in every SDK release.

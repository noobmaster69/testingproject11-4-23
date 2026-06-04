# Unit Lab Improvements Roadmap

This document lists practical improvements for the converter app, grouped by impact and effort.

## 1. High-Impact Features (Do Next)

- Add reverse time parsing: `HH:MM:SS` to decimal hours.
- Add favorites for conversion pairs (star and pin at top).
- Persist recent conversion history with `localStorage`.
- Add keyboard-first workflow:
  - Press `/` to focus value input.
  - Press `S` to swap units.
  - Press `Enter` to save conversion to history.
- Add quick clear/reset controls for active form.

## 2. Conversion Coverage Expansion

- Add pressure converters:
  - Pa, kPa, bar, psi, atm.
- Add energy converters:
  - J, kJ, cal, kcal, Wh, kWh.
- Add data size converters:
  - B, KB, MB, GB, TB, KiB, MiB, GiB.
- Add angle converters:
  - degree, radian, gradian.
- Add cooking-focused volume/weight shortcuts.

## 3. Smart UX Improvements

- Unit search in dropdowns for large categories.
- Auto-swap suggestion when selecting same from/to unit.
- Display formula and conversion factor preview.
- Add precision controls:
  - Decimal places slider or stepper.
  - Scientific notation toggle for very large/small numbers.
- Add copy formats:
  - Result only.
  - Full statement (`12 lb = 5.443 kg`).

## 4. Theme and UI Polish

- Add system theme mode (`Auto`) based on `prefers-color-scheme`.
- Add theme presets (Ocean, Slate, Solarized) with token switching.
- Add subtle animations:
  - Result value transition.
  - Chip/category hover and selection transitions.
- Improve accessibility contrast checks for all theme variants.
- Add responsive layout tuning for very small mobile screens.

## 5. Quality and Engineering

- Add unit tests for conversion math (Vitest):
  - Round-trip tests where possible.
  - Edge-case tests (negative values, zero, extremes).
- Add React component tests (Testing Library).
- Add linting and formatting:
  - ESLint + TypeScript rules.
  - Prettier.
- Add type-safe conversion schema validation.
- Split conversion data into domain modules (`src/converters/*`).

## 6. Performance and Reliability

- Lazy-load category modules if converter list grows.
- Memoize expensive computed lists.
- Add error boundaries and fallback UI.
- Add offline support with service worker (PWA).

## 7. Product/Publishing Enhancements

- Add onboarding tips for first-time users.
- Add changelog page.
- Add README screenshots and feature demos.
- Add analytics (privacy-friendly) for top used converters.
- Add feedback form link for feature requests.

## 8. Advanced Ideas

- Currency conversion with live exchange rate API.
- Voice input for conversion commands.
- Natural language parser:
  - Example: `15 pounds in kg`.
- Saved profiles for common conversion sets (fitness, cooking, travel).
- Shareable conversion URL state via query params.

## Suggested Implementation Order

1. Persist history + favorites.
2. Reverse time parser + precision controls.
3. Tests + lint/format baseline.
4. New converter categories (pressure, energy, data size).
5. Accessibility and animation polish.
6. Advanced features (currency + natural language parser).

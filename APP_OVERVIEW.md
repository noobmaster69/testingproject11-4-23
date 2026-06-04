# Unit Lab App Overview

Unit Lab is a React + TypeScript web app for fast, practical unit conversion. It is designed as a focused workspace where someone can convert measurements, save useful setups, and share exact conversion states without leaving the browser.

## What the app does

Unit Lab helps users convert values across common measurement categories, including:

- Weight
- Length
- Temperature
- Volume
- Area
- Speed
- Time
- Pressure
- Energy
- Data size
- Angle

The app also includes a live currency conversion panel, time helpers for decimal hours and clock formats, and natural-language input for quick commands like `15 lb to kg`.

## Who it is for

Unit Lab is useful for anyone who regularly needs quick conversions, such as:

- Students checking math, science, or engineering values
- Developers comparing data sizes or time values
- Travelers converting distance, speed, temperature, or currency
- Home cooks and makers converting volume or weight measurements
- Anyone who wants reusable conversion profiles and favorites

## Core experience

The main screen is a conversion workspace:

1. Choose a category.
2. Enter a value.
3. Pick the source and target units.
4. View the converted result immediately.
5. Save, copy, star, reset, or share the conversion.

The dashboard summarizes the current workspace, saved history, favorites, profiles, and active catalog size so the app feels like a reusable tool rather than a one-off calculator.

## Key features

- Multi-category conversion catalog with quick-pair shortcuts
- Searchable source and target unit selectors
- Conversion history saved locally in the browser
- Favorite unit pairs for repeat conversions
- Saved profiles for reusable conversion setups
- Shareable links that preserve the current conversion state
- Light, dark, and automatic theme modes
- Visual theme presets
- Precision controls and scientific notation
- Natural-language conversion input
- Browser voice-input hook where supported
- Time conversion helpers
- Live currency conversion
- PWA-ready build for installable/offline-friendly usage

## Data and privacy

Most app state is stored locally in the browser with `localStorage`, including history, favorites, profiles, theme settings, and onboarding state. Unit conversion data is computed in the app. The currency panel requests live exchange-rate data from the Frankfurter API.

## Technical stack

- React
- TypeScript
- Vite
- Vitest
- ESLint
- Vite PWA plugin

Unit Lab is built as a lightweight client-side app that can be deployed to GitHub Pages.

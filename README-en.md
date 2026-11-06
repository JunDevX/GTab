# GTab

**New tab = new style.**

![version](https://img.shields.io/badge/version-1.0-blue)
![platform](https://img.shields.io/badge/platform-Chromium%20%7C%20Windows-lightgrey)
![author](https://img.shields.io/badge/author-JunDevX-informational)

---

## About the Project

**GTab** is a browser extension that replaces the default new tab page with a custom, minimalist dark interface centered around the Windows system accent color.

Instead of a generic blank page, you get a clean dark theme, a centered rounded search bar, and an accent action button on the right, inspired by the design language of Android 16 / 17.

Everything is customizable: the theme, accent color, and search engine. The settings panel can be accessed directly from the extensions list with a single click.

---

## Features

### Dark Theme with System Accent Integration
The base theme is dark. By default, the accent color dynamically adapts to your system (Windows accent color), ensuring the interface feels native to any PC. The color can also be adjusted manually.

### Rounded Search Bar
A centrally positioned, rounded search bar features an accent action button on the right, inspired by Android 16 / 17 aesthetics. Queries can be submitted by pressing Enter or clicking the button.

### Search Engine Selection
- **Google**
- **Yandex**
- **DuckDuckGo**

Each search engine features a dedicated startup animation, providing a polished introduction whenever a new tab opens.

### Configuration Panel
Accessible by clicking the extension icon within the browser's extensions toolbar, allowing you to customize:
- Theme selection;
- Accent color selection;
- Search engine preference.

---

## Startup Animations

| Search Engine | Animation Event |
|---|---|
| **Google** | A gray dot emerges from the center, rapidly transitions through the Google logo colors, shifts into the letter **G**, and expands into the full word **Google**. |
| **Yandex** | The letters of the word **Yandex** smoothly rise one after another. |
| **DuckDuckGo** | A duck icon appears and swims to the right, gradually revealing the **DuckDuckGo** lettering behind it. |

Animations are short, non-blocking for user input, and play exactly once upon opening a new tab.

---

## Smart Search: Keyword Shortcuts

The search bar detects specific command keywords and routes you directly to the corresponding service, bypassing the standard search results page.

### Google

| Keyword | Target Destination |
|---|---|
| `Гемини`, `Gemini`, `гугл ии`, `google ai` | `gemini.google.com` |
| `email`, `почта`, `гугл почта`, `gmail` | `gmail.com` |

### Yandex

| Keyword | Target Destination |
|---|---|
| `ии`, `яндекс ии`, `yandex ai` | Yandex AI page |
| `email`, `яндекс почта`, `почта`, `yandex mail` | `mail.yandex.ru` |

Any query that does not match a predefined keyword is processed as a standard search through the selected engine.

---

## Workflow Overview

1. Open a new tab — the standard browser page is replaced by the GTab dark interface.
2. The animation for your chosen search engine plays.
3. Enter your query — GTab either executes a standard search or directly routes you to a service if a keyword shortcut is triggered.
4. Click the extension icon to open the configuration panel and modify the theme, accent, or search engine.

---

## Tech Stack & Core Principles

- Designed as an extension for Chromium-based browsers (Chrome, Edge, Brave, Vivaldi, etc.).
- Overrides the new tab page using native browser APIs.
- Clean interface without external dependencies — delivers fast loading times and eliminates unnecessary network overhead.
- All configuration settings are stored locally within the browser. Zero telemetry.

---

## Installation (Development Mode)

1. Download or clone this repository.
2. Navigate to the browser's extension management page (`chrome://extensions` or `edge://extensions`).
3. Enable "Developer mode".
4. Click "Load unpacked" and select the project directory.

---

## Future Roadmap

- Integration of additional search engines.
- Extended collection of themes and accent variations.
- Configuration import and export functionality.

---

## Author

**JunDevX** — [github.com/JunDevX](https://github.com/JunDevX)

Licensed under the ZAPL License.

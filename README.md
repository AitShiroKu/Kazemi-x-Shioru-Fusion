# 🌌 Kazemi x Shioru Fusion
> The ultimate hybrid Discord bot combining advanced AI capabilities with a robust music and utility core.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

## ✨ Overview
**Kazemi x Shioru Fusion** is a powerful Discord bot built by merging two distinct systems:
*   **Kazemi Core:** Driven by Google Gemini AI, featuring a persistent memory system for contextual conversations.
*   **Shioru Core:** A high-performance framework handling Music, Slash Commands, Localization (i18n), and Database integration.

---

## 🚀 Key Features

### 🧠 Kazemi AI (The Brain)
*   **Google Gemini Integration:** Natural language processing for intelligent responses.
*   **Memory System:** Remembers previous interactions to maintain context.
*   **Dynamic Embeds:** AI responses are beautifully formatted with specific color coding.

### 🎵 Shioru Core (The Muscle)
*   **Music System:** High-quality audio playback powered by DisTube.
*   **Internationalization:** Supports over 40+ languages.
*   **Scalable Architecture:** Slash & Context commands, Event handlers, and Pino logging.
*   **Database:** Integrated with Firebase for data persistence.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **Package Manager:** npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/AitShiroku/Kazemi-x-Shioru-Fusion.git
cd Kazemi-x-Shioru-Fusion
npm install
```

### 2. Configuration
Copy the environment template and fill in your keys:
```bash
cp .env.example .env
```
Edit `.env` and provide:
*   `DISCORD_TOKEN`: Your bot token from Discord Developer Portal.
*   `GEMINI_API_KEY`: Your Google Gemini API Key.

### 3. Localization & Customization
Modify `config.json` to adjust the bot's behavior and default settings.

---

## 💻 Running the Bot
| Mode | Command |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Build** | `npm run build` |
| **Production** | `npm start` |

---

## 🎨 Embed Color System
We use a specific color palette for different types of bot interactions:
| Status | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Success** | `0x57F287` | Successful actions |
| **Info** | `0x5865F2` | General information |
| **Warning** | `0xFEE75C` | System warnings |
| **Error** | `0xED4245` | Error messages |
| **AI Default** | `0xFFB6C1` | AI replies |
| **AI Thinking** | `0x9370DB` | AI processing state |

---

## 📝 License
This project is licensed under the **MIT License**.

## 👥 Authors
*   **Kazemi Core:** Pacharakan Todkaew
*   **Shioru Core:** Chaiwat Suwannarat
# Kazemi x Shioru Fusion - Discord Bot

โปรเจกต์ Discord Bot ที่รวมระบบจาก 2 โปรเจกต์:
- **Kazemi** - บอท AI ที่ใช้ Google Gemini AI พร้อมระบบจำความ (Memory System)
- **Shioru** - บอทที่มีฟีเจอร์ครบครัน (Music, Commands, Events, i18n, Database)

## 📋 สิ่งที่ต้องการติดตั้งก่อน

### 1. ติดตั้ง Node.js
```bash
# ตรวจสอบเวอร์ชั่น
node --version
# ต้องเป็น Node.js >= 18.0.0
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

หรือถ้าใช้ yarn:
```bash
yarn install
```

### 3. สร้างไฟล์ Environment
```bash
# คัดลอกจาก .env.example
cp .env.example .env
```

แก้ไขไฟล์ `.env` และใส่ค่าที่จำเป็น:
- `TOKEN` - Discord Bot Token (จำเป็น)
- `GEMINI_API_KEY` - Google Gemini API Key (จำเป็น)
- `API_KEY`, `AUTH_DOMAIN`, `DATABASE_URL`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`, `MEASUREMENT_ID` - Firebase Config (จำเป็น)

### 4. สร้างไฟล์ config.json
ไฟล์ `config.json` มีค่าตั้งค่าอยู่แล้ว สามารถแก้ไขได้ตามต้องการ

## 🏗️ โครงสร้างโปรเจกต์

```
src/
├── index.ts                    # Entry point
├── config.ts                   # Configuration
├── types/                      # TypeScript Interfaces & Types
│   └── index.ts
├── client/                     # Discord Client Setup
│   └── client.ts
├── handlers/                   # System Handlers
│   ├── command.ts              # Command loader
│   ├── context.ts              # Context loader
│   ├── event.ts                # Event loader
│   ├── player.ts               # Music player handler
│   └── process.ts              # Process handlers
├── commands/                   # Slash Commands
│   ├── developer/              # Developer commands
│   ├── fun/                    # Fun commands
│   ├── information/            # Information commands
│   ├── manager/                # Server management
│   ├── me/                     # Bot info commands
│   ├── messages/               # Message commands
│   ├── music/                  # Music commands
│   ├── settings/               # Server settings
│   └── utility/                # Utility commands
│       └── ask.ts              # AI Chat command (from Kazemi)
├── contexts/                   # Context Commands
├── events/                     # Discord Events
├── services/                   # Core Services
│   ├── ai/                     # AI Service (Gemini)
│   │   ├── gemini.ts
│   │   └── memory.ts
│   ├── i18n/                   # Internationalization
│   │   ├── i18n.ts
│   │   └── locales/
│   ├── database/               # Firebase Database
│   │   └── firebase.ts
│   ├── music/                  # Music Service (DisTube)
│   │   └── distube.ts
│   ├── embed/                  # Embed Response System
│   │   └── embedBuilder.ts
│   ├── logger/                 # Logger Service
│   │   └── logger.ts
│   └── config/                 # Config Service
│       └── config.ts
└── data/                       # Data Files
    ├── memory.json
    └── config.json
```

## 🚀 การใช้งาน

### Development Mode
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## 📝 ฟีเจอร์หลัก

### ฟีเจอร์ AI (Kazemi)
- ✅ Google Gemini AI Integration
- ✅ Memory System (จำความแชท)
- ✅ การตอบกลับด้วย Embed พร้อม Color Coding
- ✅ ระบบป้องกันเนื้อหา

### ฟีเจอร์จาก Shioru
- ✅ Slash Commands
- ✅ Context Commands
- ✅ Event Handlers
- ✅ i18n (รองรับ 40+ ภาษา)
- ✅ Music System (DisTube)
- ✅ Firebase Database
- ✅ Logger System (Pino)

## 🎨 Embed Color Coding

| สี | Hex Code | การใช้งาน |
|-----|----------|-----------|
| Success (Green) | `0x57F287` | สำเร็จ |
| Info (Blue) | `0x5865F2` | ข้อมูล |
| Warning (Yellow) | `0xFEE75C` | เตือน |
| Error (Red) | `0xED4245` | ผิดพลาด |
| AI Default (Pink) | `0xFFB6C1` | ตอบ AI (Kuniko theme) |
| AI Thinking (Purple) | `0x9370DB` | กำลังคิด |
| AI Error (Red) | `0xED4245` | ผิดพลาด AI |

## 📚 Documentation

ดูแผนการรวมระบบโดยละเอียดที่ [`plans/fusion-plan.md`](plans/fusion-plan.md)

## 📄 License

MIT

## 👨‍💻 Author

Kazemi Miharu Based - Pacharakan Todkaew
Shioru Based - Chaiwat Suwannarat


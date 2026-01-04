<p align="center">
  <h1 align="center">🖥️ Digital Desktop</h1>
  <p align="center">
    <strong>If you want to know me, come look at my computer.</strong>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-latest-000?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

<p align="center">
  English · <a href="./README.md">中文</a>
</p>

---

## 🤔 What is this?

This is my computer.

Not a metaphor. Not a "digital twin." Just my actual computer — open in your browser for you to see.

## 💡 Why did I make this?

I've always wondered how to show people "who I am."

I've made personal websites, portfolios, blogs. But every time, I felt like they only showed one small piece of me. I have too many sides. And I change too fast — by the time I finish a website, I've already become someone different.

Then I realized: **I work, create, think, socialize, and live on my computer. Most of my life happens on this screen.**

So why not just show you my computer?

I don't have to define "who I am." You can see for yourself. This is the most honest way.

## 👀 What can you see?

Currently available:

| App | Content |
|-----|---------|
| 🧠 **Claude / ChatGPT** | My AI conversations — full of my thoughts, feelings, and experiences |
| 💻 **Cursor / Antigravity / Theia** | My code — I'm a Vibe Coder |
| 📝 **Notion** | My notes and knowledge base |

Coming soon:
- 🌐 Other websites and tools I've built
- 💬 WeChat chat history (maybe)
- More parts of my life...

## 🎨 About the interface

- Currently styled as **Windows 11**
- **macOS** style coming soon (auto-detects your system)

I use both Windows and Mac, so I'll build both.

---

## 🚀 Run locally

If you want to fork this and make your own version:

```bash
# Clone
git clone https://github.com/NatureBlueee/Digital-desktop.git
cd Digital-desktop

# Install
npm install

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> No backend configuration needed. Works out of the box. Supabase and Notion are optional.

## ⚙️ Optional configuration

If you want to connect your own data:

```bash
cp .env.local.example .env.local
```

```env
# Supabase (for storing conversation history, etc.)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Notion (for displaying notes)
NOTION_API_KEY=...
```

See [docs/NOTION-SETUP-GUIDE.md](docs/NOTION-SETUP-GUIDE.md) for details.

---

## 🛠️ Tech Stack

- **Next.js** + React + TypeScript
- **Tailwind CSS** + Framer Motion
- **Zustand** (state management)
- **@dnd-kit** (drag & drop) + **react-rnd** (windows)
- **Supabase** (backend) + **Notion API**

---

## 📁 Project Structure

```
src/
├── components/
│   ├── apps/          # Apps: Claude, ChatGPT, IDE, Notion...
│   └── os/            # OS: Desktop, Taskbar, Window
├── lib/
│   ├── store/         # Zustand state
│   └── supabase/      # Database
└── app/               # Next.js App Router
```

---

## 🤝 Contributing

This is my personal project, but if you find it interesting:
- ⭐ Star it
- 🐛 Open an issue
- 🔀 Fork it and make your own version

## 📄 License

MIT

---

<p align="center">
  <sub>This is me. Come take a look.</sub>
</p>

<p align="center">
  <h1 align="center">🖥️ Digital Desktop</h1>
  <p align="center">
    <strong>如果你想了解我，就来看看我的电脑吧。</strong>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-latest-000?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

<p align="center">
  <a href="./README_EN.md">English</a> · 中文
</p>

---

## 🤔 这是什么？

这是我的电脑。

不是隐喻，不是「数字孪生」，就是我的电脑 —— 在浏览器里打开给你看。

## 💡 为什么做这个？

我一直在想怎么向别人展示「我是谁」。

做过个人网站、做过作品集、做过博客。但每次做完都觉得——这只是我的一个切面。我有太多面了，而且我变化太快，网站刚做完，人就变了。

后来我想：**我在电脑上工作、创作、思考、社交、生活。我的大部分人生都在这块屏幕里。**

那为什么不直接展示我的电脑呢？

不用我来定义「我是谁」，你自己看就好了。这是最诚实的方式。

## 👀 你能看到什么？

目前可以看到的：

| 应用 | 内容 |
|-----|------|
| 🧠 **Claude / ChatGPT** | 我和 AI 的对话历史 —— 里面有我的思考、感受、经历 |
| 💻 **Cursor / Antigravity / Theia** | 我写的代码 —— 我是个 Vibe Coder |
| 📝 **Notion** | 我的笔记和知识库 |

未来会加入：
- 🌐 我做的其他网站和工具
- 💬 微信聊天记录（也许）
- 更多我生活的部分...

## 🎨 关于界面

- 目前是 **Windows 11** 风格
- 未来会加入 **macOS** 风格（自动检测你的系统）

因为我自己用 Windows 和 Mac，所以两个都会做。

---

## 🚀 本地运行

如果你想 fork 这个项目做自己的版本：

```bash
# 克隆
git clone https://github.com/NatureBlueee/Digital-desktop.git
cd Digital-desktop

# 安装
npm install

# 运行
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

> 不需要配置任何后端，开箱即用。Supabase 和 Notion 是可选的。

## ⚙️ 可选配置

如果你想接入自己的数据：

```bash
cp .env.local.example .env.local
```

```env
# Supabase（存储对话历史等）
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Notion（展示笔记）
NOTION_API_KEY=...
```

详细配置见 [docs/NOTION-SETUP-GUIDE.md](docs/NOTION-SETUP-GUIDE.md)

---

## 🛠️ 技术栈

- **Next.js** + React + TypeScript
- **Tailwind CSS** + Framer Motion
- **Zustand**（状态管理）
- **@dnd-kit**（拖拽）+ **react-rnd**（窗口）
- **Supabase**（后端）+ **Notion API**

---

## 📁 项目结构

```
src/
├── components/
│   ├── apps/          # 应用：Claude, ChatGPT, IDE, Notion...
│   └── os/            # 系统：Desktop, Taskbar, Window
├── lib/
│   ├── store/         # Zustand 状态
│   └── supabase/      # 数据库
└── app/               # Next.js App Router
```

---

## 🤝 关于贡献

这是我的个人项目，但如果你觉得有趣，欢迎：
- ⭐ Star
- 🐛 提 Issue
- 🔀 Fork 做你自己的版本

## 📄 许可证

MIT

---

<p align="center">
  <sub>这就是我。欢迎来看看。</sub>
</p>

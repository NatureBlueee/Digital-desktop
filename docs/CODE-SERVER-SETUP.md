# Code-Server 集成指南

本项目使用 [code-server](https://github.com/coder/code-server) 提供完整的 VS Code 浏览器体验。

## 安装

### macOS
```bash
brew install code-server
```

### 其他系统
```bash
curl -fsSL https://code-server.dev/install.sh | sh
```

## 启动

```bash
# 在项目根目录运行
code-server --bind-addr 0.0.0.0:3001 --auth none .
```

或使用 npm script：
```bash
npm run code-server
```

## 访问

- **直接访问**: http://localhost:3001
- **通过 Digital Desktop**: 打开 Cursor 或 Antigravity 应用

## 开发模式

需要同时运行两个服务：

```bash
# 终端 1: Next.js 开发服务器
npm run dev

# 终端 2: code-server
npm run code-server
```

## 生产部署

生产环境建议：
1. 设置密码认证：去掉 `--auth none`
2. 使用 HTTPS
3. 配置反向代理 (nginx/caddy)

详见 [code-server 官方文档](https://coder.com/docs/code-server)

# 检查与交付

使用 Node 22 和提交的 npm 锁文件：

```sh
npm ci
npm run verify
npx playwright install chromium
npm run test:release
```

`verify` 依次运行 lint、TypeScript 检查、Notion 数据库结果兼容测试和 Next.js 生产构建。浏览器测试随后启动该构建，检查桌面窗口操作和快速切换档案对话时旧请求不会覆盖新选择。测试使用合成档案数据；不要复制真实用户档案、`.env` 或线上服务凭据到 CI。

生产测试默认使用本机 3321 端口，不复用已有服务器。端口被占用时设置 `PLAYWRIGHT_PORT`，不要停止其他服务。GitHub Actions 在 main、`ci/**` 分支和 PR 上执行同一入口，并在 Linux 安装浏览器系统依赖。

此工作流没有部署或数据库迁移步骤。分支验证通过证明源码与构建可运行，不能替代已配置的 Supabase、Notion、工作区供应商和真实档案内容的验收。生产发布继续遵循现有宿主平台的授权流程。

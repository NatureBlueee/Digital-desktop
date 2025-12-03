# 测试数据

这个目录包含用于测试API的示例数据文件。

## 文件列表

- `github-example.json` - GitHub仓库数据示例
- `chatgpt-example.json` - ChatGPT对话数据示例

## 使用方法

### 方法1: 使用curl上传

```bash
# 上传GitHub数据
curl -X POST http://localhost:3000/api/sync/upload \
  -F "file=@test-data/github-example.json" \
  -F "appType=github"

# 上传ChatGPT数据
curl -X POST http://localhost:3000/api/sync/upload \
  -F "file=@test-data/chatgpt-example.json" \
  -F "appType=chatgpt"
```

### 方法2: 使用前端上传功能

1. 启动开发服务器: `npm run dev`
2. 打开浏览器访问 http://localhost:3000
3. 点击"上传"按钮
4. 选择对应的JSON文件
5. 选择应用类型（github或chatgpt）
6. 点击上传

### 验证上传

```bash
# 查看所有应用
curl http://localhost:3000/api/apps

# 查看GitHub应用
curl http://localhost:3000/api/apps/github

# 查看ChatGPT应用
curl http://localhost:3000/api/apps/chatgpt
```

## 导出你自己的数据

### GitHub数据

1. 访问你的GitHub仓库列表
2. 手动创建JSON文件，格式参考 `github-example.json`
3. 或使用GitHub API获取：

```bash
curl https://api.github.com/users/YOUR_USERNAME/repos > my-github-data.json
```

### ChatGPT数据

1. 在ChatGPT中打开对话
2. 点击左下角的设置
3. 选择"数据控制" → "导出数据"
4. 下载后提取conversations.json
5. 或手动创建，格式参考 `chatgpt-example.json`

## 数据格式说明

详见 [API_REFERENCE.md](../docs/API_REFERENCE.md) 的"数据文件格式"部分。

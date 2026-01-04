#!/bin/bash
# 准备 showcase 展示目录的脚本
# 用于部署到 VPS 前，清理敏感文件

set -e

SHOWCASE_DIR="${1:-./showcase-repo}"

echo "准备展示目录: $SHOWCASE_DIR"

# 如果目录不存在，从 GitHub clone
if [ ! -d "$SHOWCASE_DIR" ]; then
    echo "Cloning from GitHub..."
    git clone https://github.com/NatureBlueee/Digital-desktop.git "$SHOWCASE_DIR"
fi

# 删除敏感文件
echo "删除敏感文件..."
rm -f "$SHOWCASE_DIR"/.env* 2>/dev/null || true
rm -rf "$SHOWCASE_DIR"/node_modules 2>/dev/null || true
rm -rf "$SHOWCASE_DIR"/.next 2>/dev/null || true
rm -rf "$SHOWCASE_DIR"/.agent 2>/dev/null || true
rm -rf "$SHOWCASE_DIR"/.claude 2>/dev/null || true
rm -rf "$SHOWCASE_DIR"/showcase 2>/dev/null || true
rm -rf "$SHOWCASE_DIR"/showcase-data 2>/dev/null || true

echo "✅ 展示目录准备完成: $SHOWCASE_DIR"
echo ""
echo "启动 code-server:"
echo "  docker-compose -f docker-compose.code-server.yml up -d"

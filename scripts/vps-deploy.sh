#!/bin/bash
# VPS 部署脚本 - 一键部署 code-server + PostgreSQL
# 在 VPS 上运行这个脚本

set -e

echo "========================================="
echo "  Digital Desktop VPS 部署脚本"
echo "========================================="

# 1. 更新系统
echo "📦 更新系统..."
apt update && apt upgrade -y

# 2. 安装 Docker
echo "🐳 安装 Docker..."
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 3. 安装 Docker Compose
echo "🔧 安装 Docker Compose..."
apt install -y docker-compose-plugin

# 4. 创建项目目录
echo "📁 创建项目目录..."
mkdir -p /opt/digital-desktop
cd /opt/digital-desktop

# 5. 克隆代码
echo "📥 克隆代码..."
git clone https://github.com/NatureBlueee/Digital-desktop.git showcase-repo

# 6. 删除敏感文件
echo "🔒 删除敏感文件..."
rm -f showcase-repo/.env*
rm -rf showcase-repo/node_modules
rm -rf showcase-repo/.next
rm -rf showcase-repo/.agent
rm -rf showcase-repo/.claude

# 7. 创建 Docker Compose 配置
echo "📝 创建 Docker 配置..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  code-server:
    image: codercom/code-server:latest
    container_name: showcase-ide
    restart: unless-stopped
    ports:
      - "3001:8080"
    volumes:
      - ./showcase-repo:/home/coder/project:ro
    command: --auth none --bind-addr 0.0.0.0:8080 /home/coder/project
    deploy:
      resources:
        limits:
          cpus: '0.3'
          memory: 300M

  postgres:
    image: postgres:15-alpine
    container_name: postgres-db
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: your_secure_password_here
      POSTGRES_DB: digital_desktop
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# 8. 启动服务
echo "🚀 启动服务..."
docker compose up -d

# 9. 等待启动
sleep 5

# 10. 检查状态
echo ""
echo "========================================="
echo "  ✅ 部署完成！"
echo "========================================="
echo ""
echo "📍 code-server: http://$(curl -s ifconfig.me):3001"
echo "📍 PostgreSQL: $(curl -s ifconfig.me):5432"
echo ""
echo "⚠️ 请修改 PostgreSQL 密码！"
echo "   编辑 /opt/digital-desktop/docker-compose.yml"
echo ""
docker ps

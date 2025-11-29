# Komari 监控集成使用说明

## 📋 概述

本项目已将监控系统从 Nezha（哪吒）迁移到 Komari。Komari 使用与 Nezha v1 相似的架构和配置方式，因此迁移过程相对简单。

## 🔄 从 Nezha 迁移到 Komari

### 主要变化对比

| 功能 | Nezha（旧） | Komari（新） |
|------|------------|-------------|
| 服务器地址变量 | `NEZHA_SERVER` | `KOMARI_SERVER` |
| 客户端密钥变量 | `NEZHA_KEY` | `KOMARI_KEY` |
| 端口变量 | `NEZHA_PORT` | ~~已移除~~ |
| 配置方式 | v0/v1 双模式 | 统一配置模式 |
| Agent 下载地址 | nezha agent/v1 | komari |

### 简化说明

**是的！操作流程基本一样**，只需要：
1. 将环境变量 `NEZHA_SERVER` 改为 `KOMARI_SERVER`
2. 将环境变量 `NEZHA_KEY` 改为 `KOMARI_KEY`
3. 删除 `NEZHA_PORT`（不再需要）

## 🚀 快速开始

### 环境变量配置

#### 必需变量

```bash
# Komari 服务器地址（包含端口）
KOMARI_SERVER=komari.example.com:5555

# Komari 客户端密钥
KOMARI_KEY=your_client_secret_here

# UUID（用于标识不同节点）
UUID=9afd1229-b893-40c1-84dd-51e7ce204913
```

#### 可选变量

```bash
# 节点名称（留空则使用 ISP 信息）
NAME=MyNode

# Argo 隧道配置
ARGO_DOMAIN=tunnel.example.com
ARGO_AUTH=your_argo_token_or_json

# 自动上传和保活
UPLOAD_URL=https://merge.example.com
PROJECT_URL=https://your-project.railway.app
AUTO_ACCESS=true
```

## 📖 详细使用指南

### 1. 部署到 Railway

#### 步骤 1：Fork 项目
```bash
git clone https://github.com/your-username/railway-argo
cd railway-argo
```

#### 步骤 2：在 Railway 创建新项目
1. 访问 [Railway.app](https://railway.app)
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择 fork 的仓库

#### 步骤 3：配置环境变量
在 Railway 项目的 Variables 标签页添加：

```
KOMARI_SERVER=your-komari-server.com:5555
KOMARI_KEY=your_secret_key_here
UUID=generate-unique-uuid-for-this-node
```

#### 步骤 4：部署
Railway 会自动检测 Dockerfile 并开始构建部署。

### 2. 本地开发/测试

#### 安装依赖
```bash
npm install
```

#### 创建 .env 文件
```bash
cat > .env << EOF
KOMARI_SERVER=localhost:5555
KOMARI_KEY=test_secret
UUID=9afd1229-b893-40c1-84dd-51e7ce204913
PORT=3000
EOF
```

#### 启动服务
```bash
node index.js
```

### 3. Docker 部署

#### 构建镜像
```bash
docker build -t railway-argo-komari .
```

#### 运行容器
```bash
docker run -d \
  -e KOMARI_SERVER=komari.example.com:5555 \
  -e KOMARI_KEY=your_secret_key \
  -e UUID=your-unique-uuid \
  -p 3000:3000 \
  railway-argo-komari
```

## 🔧 Komari 配置详解

### 服务器地址格式

Komari 使用**统一的地址格式**，不再区分 v0 和 v1：

```bash
# 标准格式：域名:端口
KOMARI_SERVER=monitor.example.com:5555

# TLS 端口会自动识别（443, 8443, 2096, 2087, 2083, 2053）
KOMARI_SERVER=monitor.example.com:443  # 自动启用 TLS
```

### 自动 TLS 检测

项目会根据端口自动判断是否启用 TLS：
- **TLS 端口**：443, 8443, 2096, 2087, 2083, 2053
- **普通端口**：其他端口使用非加密连接

### 生成的配置文件示例

项目会自动生成 `config.yaml`：

```yaml
client_secret: your_secret_key
debug: false
disable_auto_update: true
disable_command_execute: false
disable_force_update: true
disable_nat: false
disable_send_query: false
gpu: false
insecure_tls: true
ip_report_period: 1800
report_delay: 4
server: komari.example.com:5555
skip_connection_count: true
skip_procs_count: true
temperature: false
tls: true
use_gitee_to_upgrade: false
use_ipv6_country_code: false
uuid: 9afd1229-b893-40c1-84dd-51e7ce204913
```

## 📊 监控数据说明

### 上报的数据

Komari Agent 会上报以下信息：
- ✅ CPU 使用率
- ✅ 内存使用情况
- ✅ 磁盘使用情况
- ✅ 网络流量统计
- ✅ 在线状态
- ✅ 系统负载
- ❌ GPU 信息（已禁用）
- ❌ 温度信息（已禁用）
- ❌ 连接数统计（已跳过）
- ❌ 进程数统计（已跳过）

### 优化配置

为了减少资源占用，以下功能已优化：
- `skip_connection_count: true` - 跳过连接数统计
- `skip_procs_count: true` - 跳过进程数统计
- `report_delay: 4` - 上报延迟 4 秒
- `ip_report_period: 1800` - IP 上报周期 30 分钟

## 🆚 Nezha vs Komari 对比

### 相同点
✅ 配置文件格式相同（YAML）  
✅ TLS 支持方式相同  
✅ UUID 机制相同  
✅ 数据上报内容基本一致  

### 不同点
❌ Komari 不再区分 v0/v1 版本  
❌ 不需要单独的 `PORT` 变量  
✅ Komari 配置更简化  
✅ Komari 性能更优  

## 🔍 故障排查

### 1. Agent 未连接到服务器

**检查项：**
```bash
# 查看日志
docker logs <container_id>

# 检查环境变量
echo $KOMARI_SERVER
echo $KOMARI_KEY
```

**常见问题：**
- ❌ 服务器地址格式错误（应包含端口）
- ❌ 密钥不正确
- ❌ 防火墙阻止连接
- ❌ TLS 配置不匹配

### 2. 节点显示离线

**可能原因：**
1. UUID 冲突（多个节点使用相同 UUID）
2. 网络连接中断
3. Komari 服务器故障

**解决方案：**
```bash
# 为每个节点生成唯一 UUID
uuidgen  # Linux/Mac
# 或使用在线生成器：https://www.uuidgenerator.net/
```

### 3. Agent 启动失败

**检查必需变量：**
```bash
# 确保这两个变量都已设置
if [ -z "$KOMARI_SERVER" ]; then
  echo "错误：KOMARI_SERVER 未设置"
fi

if [ -z "$KOMARI_KEY" ]; then
  echo "错误：KOMARI_KEY 未设置"
fi
```

## 📝 完整配置示例

### Railway 部署示例

```env
# Komari 监控（必需）
KOMARI_SERVER=monitor.mydomain.com:5555
KOMARI_KEY=sk_abc123def456ghi789
UUID=550e8400-e29b-41d4-a716-446655440000

# 节点配置
NAME=Railway-US-West

# Argo 隧道（可选）
ARGO_DOMAIN=tunnel.mydomain.com
ARGO_AUTH=eyJhIjoixxxxxxx...

# 订阅功能（可选）
UPLOAD_URL=https://merge.mydomain.com
PROJECT_URL=https://my-railway-app.railway.app
AUTO_ACCESS=true

# 其他配置（可选）
CFIP=cdns.doon.eu.org
CFPORT=443
FILE_PATH=./tmp
SUB_PATH=sub
```

### Docker Compose 示例

```yaml
version: '3'
services:
  railway-argo:
    build: .
    environment:
      - KOMARI_SERVER=monitor.example.com:5555
      - KOMARI_KEY=your_secret_key
      - UUID=550e8400-e29b-41d4-a716-446655440000
      - NAME=Docker-Node-01
      - PORT=3000
    ports:
      - "3000:3000"
    restart: unless-stopped
```

## 🎯 最佳实践

### 1. UUID 管理
- ✅ 每个部署实例使用**唯一** UUID
- ✅ 使用有意义的命名配合 NAME 变量
- ❌ 不要在多个节点复用 UUID

### 2. 安全建议
- ✅ 使用环境变量存储敏感信息
- ✅ 定期轮换 KOMARI_KEY
- ✅ 限制服务器访问端口
- ❌ 不要在代码中硬编码密钥

### 3. 性能优化
- ✅ 保持 `skip_connection_count` 和 `skip_procs_count` 为 true
- ✅ 适当调整 `ip_report_period`
- ✅ 在资源受限环境禁用 GPU 和温度监控

## 🔗 相关链接

- [项目仓库](https://github.com/your-repo/railway-argo)
- [Railway 部署文档](https://docs.railway.app/)
- [Dockerfile 参考](https://docs.docker.com/engine/reference/builder/)

## ❓ 常见问题 FAQ

### Q1: Komari 和 Nezha 可以共存吗？
A: 不建议。项目已完全迁移到 Komari，不再支持 Nezha 配置。

### Q2: 如何获取 Komari 服务器地址和密钥？
A: 需要自行部署 Komari 服务器，或使用第三方提供的 Komari 服务。

### Q3: 必须使用 Railway 部署吗？
A: 不是。可以部署到任何支持 Docker 的平台（Render, Fly.io, VPS 等）。

### Q4: 订阅功能是什么？
A: 项目会生成 VLESS/VMESS/Trojan 节点订阅，可通过 `/${SUB_PATH}` 路径访问。

### Q5: 如何验证 Komari 连接成功？
A: 查看日志中的 "php is running" 消息，并在 Komari 面板检查节点状态。

## 📞 技术支持

如遇问题，请：
1. 检查本文档的故障排查章节
2. 查看容器/应用日志
3. 提交 GitHub Issue（包含日志信息）

---

**最后更新**: 2024  
**版本**: v2.0 (Komari)

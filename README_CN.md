# Railway Argo - Komari 监控版

> 基于 Node.js 的 Xray + Argo 隧道 + Komari 监控一体化方案

## 🎉 更新说明

**v2.0 重要更新**：项目已从 Nezha（哪吒）监控迁移到 Komari 监控系统！

### 迁移很简单！只需 3 步：

1. **删除**旧的 Nezha 变量：
   - ~~NEZHA_SERVER~~
   - ~~NEZHA_PORT~~
   - ~~NEZHA_KEY~~

2. **添加**新的 Komari 变量：
   - `KOMARI_SERVER` （服务器地址，格式：domain:port）
   - `KOMARI_KEY` （客户端密钥）

3. **保持**其他配置不变！

## ⚡ 快速部署

### Railway 一键部署

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**必需环境变量**：
```bash
KOMARI_SERVER=your-server.com:5555
KOMARI_KEY=your_secret_key
UUID=generate-your-uuid-here
```

### Docker 部署

```bash
docker run -d \
  -e KOMARI_SERVER=monitor.example.com:5555 \
  -e KOMARI_KEY=your_secret \
  -e UUID=your-uuid \
  -p 3000:3000 \
  your-image-name
```

## 📋 环境变量配置

### 核心配置（监控）

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `KOMARI_SERVER` | ✅ | Komari 服务器地址:端口 | `monitor.com:5555` |
| `KOMARI_KEY` | ✅ | 客户端密钥 | `sk_abc123...` |
| `UUID` | ✅ | 节点唯一标识 | `uuid-here` |

### 隧道配置（可选）

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `ARGO_DOMAIN` | ❌ | 固定隧道域名 | `tunnel.example.com` |
| `ARGO_AUTH` | ❌ | 隧道 Token 或 JSON | `eyJhIjoi...` |
| `ARGO_PORT` | ❌ | 隧道端口 | `8001` (默认) |

### 订阅配置（可选）

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `UPLOAD_URL` | ❌ | 节点上传地址 | `https://merge.xxx.com` |
| `PROJECT_URL` | ❌ | 项目访问地址 | `https://app.railway.app` |
| `AUTO_ACCESS` | ❌ | 自动保活 | `true` / `false` |
| `SUB_PATH` | ❌ | 订阅路径 | `sub` (默认) |

### 其他配置

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NAME` | ❌ | (空) | 节点名称 |
| `PORT` | ❌ | `3000` | HTTP 服务端口 |
| `CFIP` | ❌ | `cdns.doon.eu.org` | 优选 IP/域名 |
| `CFPORT` | ❌ | `443` | 优选端口 |
| `FILE_PATH` | ❌ | `./tmp` | 工作目录 |

## 🔄 从 Nezha 迁移

**是的！操作流程基本一样！**

### 变量对照表

| Nezha（旧） | Komari（新） | 说明 |
|-------------|-------------|------|
| `NEZHA_SERVER` | `KOMARI_SERVER` | 包含端口，如 `server:5555` |
| `NEZHA_PORT` | ~~删除~~ | 不再需要单独的端口变量 |
| `NEZHA_KEY` | `KOMARI_KEY` | 客户端密钥 |

### 迁移示例

**原 Nezha 配置**：
```bash
NEZHA_SERVER=monitor.com
NEZHA_PORT=5555
NEZHA_KEY=secret123
```

**新 Komari 配置**：
```bash
KOMARI_SERVER=monitor.com:5555  # 合并了地址和端口
KOMARI_KEY=secret123             # 密钥名称改变
```

就这么简单！🎉

## 🔧 工作原理

```
┌─────────────────────────────────────────┐
│         Railway / Docker 容器            │
│                                         │
│  ┌──────────┐      ┌──────────┐       │
│  │  Komari  │──────│  Xray    │       │
│  │  Agent   │      │  Core    │       │
│  └──────────┘      └──────────┘       │
│       │                  │             │
│       │                  │             │
└───────┼──────────────────┼─────────────┘
        │                  │
        ▼                  ▼
  Komari 面板        Cloudflare Argo
  (监控数据)         (流量代理)
```

### 功能说明

1. **Komari Agent**：上报系统监控数据到 Komari 面板
2. **Xray Core**：提供代理服务（VLESS/VMESS/Trojan）
3. **Cloudflare Argo**：创建安全隧道，暴露服务到公网
4. **Express 服务**：提供订阅接口和健康检查

## 📊 订阅使用

部署成功后，可通过以下地址获取订阅：

```
https://your-app.railway.app/sub
```

### 支持的协议

- ✅ VLESS + WebSocket + TLS
- ✅ VMESS + WebSocket + TLS
- ✅ Trojan + WebSocket + TLS

### 订阅格式

返回 Base64 编码的订阅内容，可直接导入到：
- Clash
- V2RayN
- V2RayNG
- Shadowrocket
- 等主流客户端

## 🛠️ 本地开发

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件：

```bash
KOMARI_SERVER=localhost:5555
KOMARI_KEY=test_key
UUID=550e8400-e29b-41d4-a716-446655440000
PORT=3000
```

### 启动服务

```bash
node index.js
```

### 访问服务

- 健康检查：`http://localhost:3000/`
- 订阅地址：`http://localhost:3000/sub`

## 🐳 Docker 构建

### 构建镜像

```bash
docker build -t railway-argo-komari .
```

### 运行容器

```bash
docker run -d \
  --name railway-argo \
  -e KOMARI_SERVER=monitor.example.com:5555 \
  -e KOMARI_KEY=your_secret_key \
  -e UUID=your-unique-uuid \
  -p 3000:3000 \
  railway-argo-komari
```

### 查看日志

```bash
docker logs -f railway-argo
```

## 🎯 最佳实践

### 1. UUID 唯一性

⚠️ **重要**：每个部署实例必须使用**不同的 UUID**！

```bash
# 生成新的 UUID（Linux/Mac）
uuidgen

# 或使用 Node.js
node -e "console.log(require('crypto').randomUUID())"
```

### 2. 节点命名

使用 `NAME` 变量为节点命名，便于识别：

```bash
NAME=Railway-US-West-01
```

如果不设置，将自动使用 ISP 信息命名。

### 3. TLS 端口

Komari 会根据端口自动判断是否启用 TLS：

**自动启用 TLS 的端口**：`443`, `8443`, `2096`, `2087`, `2083`, `2053`

```bash
KOMARI_SERVER=monitor.com:443   # 自动启用 TLS
KOMARI_SERVER=monitor.com:5555  # 不启用 TLS
```

### 4. 安全建议

- ✅ 使用环境变量管理敏感信息
- ✅ 定期更换 `KOMARI_KEY`
- ✅ 限制监控面板访问
- ❌ 不要在公开代码中暴露密钥

## 🔍 故障排查

### Agent 未连接

**症状**：Komari 面板显示节点离线

**检查清单**：
```bash
# 1. 验证环境变量
echo $KOMARI_SERVER
echo $KOMARI_KEY

# 2. 检查网络连接
ping your-komari-server.com
telnet your-komari-server.com 5555

# 3. 查看应用日志
docker logs your-container
# 或 Railway 控制台查看日志
```

**常见问题**：
- ❌ 服务器地址格式错误（忘记端口）
- ❌ 防火墙阻止连接
- ❌ UUID 冲突（多节点使用相同 UUID）

### 订阅无法访问

**症状**：访问 `/sub` 返回错误

**可能原因**：
1. Argo 隧道未成功建立
2. `ARGO_AUTH` 配置错误
3. 应用启动失败

**解决方法**：
```bash
# 查看启动日志
# 应该看到：
# "App is running"
# "webName is running"
# "botName is running"
# "phpName is running" (如果配置了 Komari)
```

## 📚 详细文档

需要更详细的说明？请查看：

- [📖 Komari 完整使用指南](./KOMARI_USAGE.md) - 详细配置和故障排查
- [🐳 Dockerfile](./Dockerfile) - 容器构建配置
- [📦 package.json](./package.json) - 依赖列表

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](./LICENSE)

## ⭐ Star History

如果这个项目对你有帮助，请给个 Star ⭐

---

**版本**：v2.0 (Komari)  
**更新日期**：2024


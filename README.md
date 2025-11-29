# Railway Argo - Komari Edition

[![Railway Deploy](https://railway.app/button.svg)](https://railway.app/new)

> A complete Xray + Argo Tunnel + Komari Monitoring solution for Railway/Docker deployment

## 🎉 Major Update - v2.0

**We've migrated from Nezha to Komari monitoring!**

### ✨ What's New?

- 🔄 **Simplified Configuration** - Unified format, no more version confusion
- 🚀 **Better Performance** - Optimized reporting intervals
- 📊 **Same Monitoring Features** - All the data you need
- ⚡ **Easy Migration** - Just rename environment variables!

## 🚀 Quick Start

### Railway Deployment

1. Click the deploy button above
2. Set environment variables:
   ```bash
   KOMARI_SERVER=your-server.com:5555
   KOMARI_KEY=your_secret_key
   UUID=your-unique-uuid
   ```
3. Deploy!

### Docker Deployment

```bash
docker run -d \
  -e KOMARI_SERVER=monitor.example.com:5555 \
  -e KOMARI_KEY=your_secret_key \
  -e UUID=your-unique-uuid \
  -p 3000:3000 \
  your-image-name
```

## 📚 Documentation

### For Chinese Users (中文用户)

- **[📖 中文 README](./README_CN.md)** - 完整的中文说明
- **[🔧 Komari 详细使用指南](./KOMARI_USAGE.md)** - Komari 配置和故障排查
- **[🔄 迁移指南](./MIGRATION_GUIDE.md)** - 从 Nezha 迁移到 Komari
- **[📊 功能对比](./COMPARISON.md)** - Nezha vs Komari 详细对比

### English Documentation

- **[Quick Start Guide](#quick-start)** - Get started in minutes
- **[Environment Variables](#environment-variables)** - Configuration reference
- **[Migration Guide](#migration-from-nezha)** - Upgrade from Nezha

## ⚙️ Environment Variables

### Required (Monitoring)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `KOMARI_SERVER` | ✅ | Komari server address with port | `monitor.com:5555` |
| `KOMARI_KEY` | ✅ | Client secret key | `sk_abc123...` |
| `UUID` | ✅ | Unique node identifier | Generate with `uuidgen` |

### Optional (Tunnel)

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `ARGO_DOMAIN` | ❌ | Fixed tunnel domain | - |
| `ARGO_AUTH` | ❌ | Tunnel token or JSON | - |
| `ARGO_PORT` | ❌ | Tunnel port | `8001` |

### Optional (Subscription)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `UPLOAD_URL` | ❌ | Node upload URL | `https://merge.xxx.com` |
| `PROJECT_URL` | ❌ | Project URL | `https://app.railway.app` |
| `AUTO_ACCESS` | ❌ | Enable auto keep-alive | `true` / `false` |
| `SUB_PATH` | ❌ | Subscription path | `sub` |

### Optional (General)

| Variable | Default | Description |
|----------|---------|-------------|
| `NAME` | - | Node name |
| `PORT` | `3000` | HTTP server port |
| `CFIP` | `cdns.doon.eu.org` | CloudFlare IP/domain |
| `CFPORT` | `443` | CloudFlare port |

## 🔄 Migration from Nezha

**It's super easy!** Just rename your environment variables:

### Variable Mapping

| Nezha (Old) | Komari (New) | Notes |
|-------------|--------------|-------|
| `NEZHA_SERVER` | `KOMARI_SERVER` | Include port: `server:5555` |
| `NEZHA_PORT` | ~~Remove~~ | No longer needed |
| `NEZHA_KEY` | `KOMARI_KEY` | Just rename |
| `UUID` | `UUID` | ✅ Keep the same |

### Example

**Before (Nezha)**:
```bash
NEZHA_SERVER=monitor.com
NEZHA_PORT=5555
NEZHA_KEY=secret123
UUID=your-uuid
```

**After (Komari)**:
```bash
KOMARI_SERVER=monitor.com:5555  # Combined address + port
KOMARI_KEY=secret123             # Renamed
UUID=your-uuid                   # Unchanged
```

**That's it!** 🎉

## 📖 Features

- ✅ **Xray Core** - VLESS/VMESS/Trojan protocols
- ✅ **Cloudflare Argo** - Secure tunnel with auto-domain
- ✅ **Komari Monitoring** - Real-time system monitoring
- ✅ **Subscription API** - Base64 encoded node list
- ✅ **Auto Upload** - Integration with merge-sub services
- ✅ **Health Check** - Built-in status endpoint
- ✅ **Multi-arch** - Supports AMD64 and ARM64

## 🔍 How It Works

```
┌─────────────────────────────────────────┐
│         Railway / Docker Container       │
│                                         │
│  ┌──────────┐      ┌──────────┐       │
│  │  Komari  │──────│  Xray    │       │
│  │  Agent   │      │  Core    │       │
│  └──────────┘      └──────────┘       │
│       │                  │             │
└───────┼──────────────────┼─────────────┘
        │                  │
        ▼                  ▼
  Komari Panel      Cloudflare Argo
  (Monitoring)       (Traffic Proxy)
```

## 📊 Subscription Usage

After deployment, get your subscription at:

```
https://your-app.railway.app/sub
```

### Supported Protocols

- VLESS + WebSocket + TLS
- VMESS + WebSocket + TLS
- Trojan + WebSocket + TLS

Compatible with:
- Clash
- V2RayN/V2RayNG
- Shadowrocket
- Most V2Ray clients

## 🛠️ Development

### Install Dependencies

```bash
npm install
```

### Set Environment Variables

Create `.env` file:

```bash
KOMARI_SERVER=localhost:5555
KOMARI_KEY=test_key
UUID=550e8400-e29b-41d4-a716-446655440000
PORT=3000
```

### Start Server

```bash
node index.js
```

### Access

- Health check: `http://localhost:3000/`
- Subscription: `http://localhost:3000/sub`

## 🐳 Docker

### Build

```bash
docker build -t railway-argo-komari .
```

### Run

```bash
docker run -d \
  --name railway-argo \
  -e KOMARI_SERVER=monitor.example.com:5555 \
  -e KOMARI_KEY=your_secret_key \
  -e UUID=your-unique-uuid \
  -p 3000:3000 \
  railway-argo-komari
```

### View Logs

```bash
docker logs -f railway-argo
```

## 📝 Best Practices

### 1. Unique UUID

⚠️ **Important**: Each deployment MUST use a different UUID!

```bash
# Generate UUID (Linux/Mac)
uuidgen

# Or use Node.js
node -e "console.log(require('crypto').randomUUID())"
```

### 2. Node Naming

Use `NAME` variable for better identification:

```bash
NAME=Railway-US-West-01
```

### 3. TLS Auto-Detection

Komari automatically detects TLS based on port:

**TLS Ports**: `443`, `8443`, `2096`, `2087`, `2083`, `2053`

```bash
KOMARI_SERVER=monitor.com:443   # TLS enabled
KOMARI_SERVER=monitor.com:5555  # TLS disabled
```

## 🔍 Troubleshooting

### Agent Not Connected

**Symptoms**: Node shows offline in Komari panel

**Checklist**:
```bash
# 1. Verify environment variables
echo $KOMARI_SERVER
echo $KOMARI_KEY

# 2. Check network connectivity
ping your-komari-server.com
telnet your-komari-server.com 5555

# 3. View application logs
docker logs your-container
```

**Common Issues**:
- ❌ Wrong server address format (missing port)
- ❌ Firewall blocking connection
- ❌ UUID conflict (multiple nodes using same UUID)

### Subscription Not Working

**Symptoms**: Cannot access `/sub` endpoint

**Possible Causes**:
1. Argo tunnel not established
2. `ARGO_AUTH` misconfigured
3. Application startup failed

**Solution**:
Check logs for:
- "App is running"
- "webName is running"
- "botName is running"
- "phpName is running" (if Komari configured)

## 🤝 Contributing

Contributions welcome! Please submit issues and pull requests.

## 📄 License

[MIT License](./LICENSE)

## 🌟 Star History

If this project helps you, please give it a star ⭐

---

**Version**: v2.0 (Komari)  
**Last Updated**: 2024

## 📞 Support

Need help?

1. **Check Documentation** - Most issues are covered in the docs
2. **View Logs** - Check container/application logs
3. **Submit Issue** - Include log information on GitHub

---

### 中文用户？

请查看 [中文文档](./README_CN.md) 获取完整的中文说明！

**一句话总结：Komari 和哪吒操作流程完全一样，只是环境变量名不同！** 🎉

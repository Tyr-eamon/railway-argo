# Komari 快速参考卡片 🚀

## 📋 环境变量速查表

### 最小配置（2个变量）
```bash
KOMARI_SERVER=monitor.example.com:5555  # 服务器地址:端口
KOMARI_KEY=your_secret_key              # 客户端密钥
```

### 推荐配置（+1个变量）
```bash
KOMARI_SERVER=monitor.example.com:5555
KOMARI_KEY=your_secret_key
UUID=550e8400-e29b-41d4-a716-446655440000  # 唯一标识
```

### 完整配置
```bash
# === Komari 监控（必需）===
KOMARI_SERVER=monitor.example.com:5555
KOMARI_KEY=your_secret_key
UUID=550e8400-e29b-41d4-a716-446655440000

# === 节点设置 ===
NAME=MyNode-01

# === Argo 隧道（可选）===
ARGO_DOMAIN=tunnel.example.com
ARGO_AUTH=your_token_or_json
ARGO_PORT=8001

# === 订阅功能（可选）===
UPLOAD_URL=https://merge.example.com
PROJECT_URL=https://app.railway.app
AUTO_ACCESS=true
SUB_PATH=sub

# === 其他配置 ===
PORT=3000
CFIP=cdns.doon.eu.org
CFPORT=443
```

## 🔄 Nezha → Komari 转换

```bash
# 删除这些
NEZHA_SERVER=xxx    →  删除
NEZHA_PORT=xxx      →  删除
NEZHA_KEY=xxx       →  删除

# 添加这些
                    →  KOMARI_SERVER=xxx:5555  # 注意包含端口！
                    →  KOMARI_KEY=xxx
```

## ⚡ TLS 端口速查

| 端口 | TLS | 说明 |
|------|-----|------|
| 443 | ✅ 是 | HTTPS 标准端口 |
| 8443 | ✅ 是 | 备用 HTTPS 端口 |
| 2053 | ✅ 是 | Cloudflare |
| 2083 | ✅ 是 | Cloudflare |
| 2087 | ✅ 是 | Cloudflare |
| 2096 | ✅ 是 | Cloudflare |
| 5555 | ❌ 否 | 常用监控端口 |
| 8080 | ❌ 否 | HTTP 备用端口 |

## 📝 常用命令

### 生成 UUID
```bash
# Linux/Mac
uuidgen

# Node.js
node -e "console.log(require('crypto').randomUUID())"

# 在线生成
# https://www.uuidgenerator.net/
```

### Docker 操作
```bash
# 查看日志
docker logs -f container_name

# 重启容器
docker restart container_name

# 查看环境变量
docker inspect container_name | grep -A 20 "Env"
```

### Railway 操作
```bash
# 通过 CLI 查看日志
railway logs

# 设置环境变量
railway variables set KOMARI_SERVER=xxx:5555
```

## 🔍 故障排查速查

### 症状 1：节点离线

**检查顺序**：
1. ✅ `KOMARI_SERVER` 格式正确？（包含端口）
2. ✅ `KOMARI_KEY` 是否正确？
3. ✅ 网络能否访问服务器？
4. ✅ UUID 是否冲突？

**快速测试**：
```bash
telnet your-server.com 5555
```

### 症状 2：订阅无法访问

**检查顺序**：
1. ✅ 应用是否启动成功？
2. ✅ Argo 隧道是否建立？
3. ✅ 路由路径正确？（默认 `/sub`）

**快速测试**：
```bash
curl https://your-app.railway.app/sub
```

### 症状 3：启动失败

**查看日志关键词**：
- ✅ "App is running" - 应用启动成功
- ✅ "phpName is running" - Komari agent 运行
- ❌ "KOMARI variable is empty" - 环境变量未设置
- ❌ "error" - 查看具体错误信息

## 📊 监控数据说明

### 默认上报（已启用）
- ✅ CPU 使用率
- ✅ 内存使用
- ✅ 磁盘使用
- ✅ 网络流量
- ✅ 系统负载

### 默认跳过（性能优化）
- ⏭️ 连接数统计
- ⏭️ 进程数统计
- ⏭️ GPU 信息
- ⏭️ 温度信息

### 上报频率
- ⏱️ 基础监控：每 4 秒
- ⏱️ IP 信息：每 30 分钟

## 🔗 链接速查

### 文档
- [完整使用指南](./KOMARI_USAGE.md) - 详细配置和故障排查
- [迁移指南](./MIGRATION_GUIDE.md) - 从 Nezha 迁移步骤
- [中文 README](./README_CN.md) - 中文完整说明
- [功能对比](./COMPARISON.md) - Nezha vs Komari

### 访问地址
- 健康检查：`https://your-app/`
- 订阅地址：`https://your-app/sub`（或自定义 SUB_PATH）

### 在线工具
- UUID 生成器：https://www.uuidgenerator.net/
- Base64 解码：https://www.base64decode.org/
- Railway 平台：https://railway.app/

## ⚙️ 配置模板

### Railway 环境变量（复制粘贴）
```
KOMARI_SERVER=your-server.com:5555
KOMARI_KEY=your_secret_key
UUID=generate-uuid-here
NAME=Railway-Node-01
```

### Docker Compose 模板
```yaml
version: '3'
services:
  railway-argo:
    image: your-image
    environment:
      - KOMARI_SERVER=monitor.example.com:5555
      - KOMARI_KEY=your_secret_key
      - UUID=your-unique-uuid
      - NAME=Docker-Node-01
    ports:
      - "3000:3000"
    restart: unless-stopped
```

### .env 模板（本地开发）
```bash
KOMARI_SERVER=localhost:5555
KOMARI_KEY=test_key
UUID=550e8400-e29b-41d4-a716-446655440000
PORT=3000
NAME=Dev-Node
```

## 💡 小贴士

### Tip 1: UUID 管理
```bash
# 为不同环境使用不同 UUID
Production:  550e8400-e29b-41d4-a716-446655440000
Staging:     660e8400-e29b-41d4-a716-446655440001
Development: 770e8400-e29b-41d4-a716-446655440002
```

### Tip 2: 节点命名规范
```bash
# 推荐格式：平台-地区-序号
NAME=Railway-US-West-01
NAME=Docker-Asia-SG-01
NAME=Render-EU-London-01
```

### Tip 3: 日志搜索
```bash
# 快速查找关键信息
docker logs container | grep "running"
docker logs container | grep "error"
docker logs container | grep "KOMARI"
```

### Tip 4: 批量部署
```bash
# 使用循环部署多个节点（记得改 UUID！）
for i in {1..3}; do
  docker run -d \
    -e KOMARI_SERVER=monitor.com:5555 \
    -e KOMARI_KEY=key \
    -e UUID=$(uuidgen) \
    -e NAME=Node-$i \
    your-image
done
```

## 🎯 记住这些！

✅ **KOMARI_SERVER 必须包含端口**  
✅ **每个节点使用唯一 UUID**  
✅ **操作流程和哪吒完全一样**  
✅ **查看日志是解决问题的第一步**  

## ❓ 一分钟 FAQ

**Q: 怎么知道 Komari 连接成功？**  
A: 日志显示 "phpName is running" + 面板显示在线

**Q: 订阅地址是什么？**  
A: `https://你的域名/sub`（或自定义路径）

**Q: 必须设置 UUID 吗？**  
A: 强烈推荐！否则可能导致节点冲突

**Q: 支持 Windows 部署吗？**  
A: 支持 Docker Desktop on Windows

**Q: 可以在 VPS 上运行吗？**  
A: 当然！任何支持 Docker 的环境都可以

---

**打印这张卡片，贴在显示器旁边！** 📌

需要详细说明？查看 [完整文档](./KOMARI_USAGE.md)

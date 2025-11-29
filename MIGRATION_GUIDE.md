# 从 Nezha 迁移到 Komari - 快速指南

## 📝 3 分钟完成迁移

### TL;DR（太长不看版）

**操作和哪吒一模一样！** 只是变量名改了：

```diff
- NEZHA_SERVER=monitor.com
- NEZHA_PORT=5555
- NEZHA_KEY=secret123
+ KOMARI_SERVER=monitor.com:5555
+ KOMARI_KEY=secret123
```

## 🔄 详细迁移步骤

### 步骤 1：停止旧部署（可选）

如果你要在同一个平台迁移，建议先停止旧的部署。

**Railway**：
- 暂停旧项目，或直接修改环境变量

**Docker**：
```bash
docker stop your-container-name
```

### 步骤 2：更新环境变量

#### Railway 平台

1. 进入项目 → **Variables** 标签
2. 删除旧变量：
   - 点击 `NEZHA_SERVER` 右侧的 ❌ 删除
   - 点击 `NEZHA_PORT` 右侧的 ❌ 删除
   - 点击 `NEZHA_KEY` 右侧的 ❌ 删除

3. 添加新变量：
   - 点击 **New Variable**
   - 名称：`KOMARI_SERVER`
   - 值：`your-server.com:5555` （**注意要包含端口！**）
   - 点击 **Add**
   
   - 点击 **New Variable**
   - 名称：`KOMARI_KEY`
   - 值：你的密钥
   - 点击 **Add**

4. 保存并重新部署

#### Docker / Docker Compose

**旧配置** (docker-compose.yml)：
```yaml
services:
  app:
    environment:
      - NEZHA_SERVER=monitor.com
      - NEZHA_PORT=5555
      - NEZHA_KEY=secret123
      - UUID=your-uuid
```

**新配置** (docker-compose.yml)：
```yaml
services:
  app:
    environment:
      - KOMARI_SERVER=monitor.com:5555  # 合并地址和端口
      - KOMARI_KEY=secret123            # 改名
      - UUID=your-uuid                  # 不变
```

#### 命令行部署

**旧命令**：
```bash
docker run -d \
  -e NEZHA_SERVER=monitor.com \
  -e NEZHA_PORT=5555 \
  -e NEZHA_KEY=secret123 \
  -e UUID=your-uuid \
  your-image
```

**新命令**：
```bash
docker run -d \
  -e KOMARI_SERVER=monitor.com:5555 \  # 注意端口包含在这里
  -e KOMARI_KEY=secret123 \
  -e UUID=your-uuid \
  your-image
```

### 步骤 3：验证部署

#### 检查日志

**Railway**：
- 进入项目 → **Deployments** → 点击最新部署 → 查看日志

**Docker**：
```bash
docker logs -f your-container-name
```

#### 应该看到的日志输出

✅ 成功的日志：
```
tmp is created
Empowerment success for /tmp/xxxxxx: 775
Download web successfully
Download bot successfully
Download komari successfully  ← 注意是 komari
phpName is running            ← Komari agent
webName is running
botName is running
App is running
Thank you for using this script, enjoy!
```

❌ 如果看到：
```
KOMARI variable is empty, skip running
```
说明环境变量未正确设置！

#### 检查 Komari 面板

1. 登录你的 Komari 监控面板
2. 查看节点列表
3. 应该能看到新上线的节点（使用你设置的 UUID）

### 步骤 4：测试功能

#### 测试订阅功能

访问订阅地址：
```
https://your-app.railway.app/sub
```

应该返回 Base64 编码的订阅内容。

#### 测试健康检查

访问根路径：
```
https://your-app.railway.app/
```

应该返回：`Hello world!`

## 📋 完整配置对比

### Nezha（旧系统）

#### 简单配置（Nezha v0）
```bash
NEZHA_SERVER=monitor.com
NEZHA_PORT=5555
NEZHA_KEY=secret123
UUID=your-uuid
```

#### 完整配置（Nezha v1）
```bash
NEZHA_SERVER=monitor.com:8008
NEZHA_PORT=              # v1 留空
NEZHA_KEY=nz_client_secret
UUID=your-uuid
NAME=MyNode
```

### Komari（新系统）

#### 统一配置
```bash
KOMARI_SERVER=monitor.com:5555  # 始终包含端口
KOMARI_KEY=secret123
UUID=your-uuid
NAME=MyNode
```

**更简单！不再区分版本！**

## 🔍 常见问题

### Q1: 为什么要迁移到 Komari？

A: Komari 提供了：
- ✅ 更简化的配置（统一格式）
- ✅ 更好的性能
- ✅ 更稳定的连接
- ✅ 持续的维护支持

### Q2: Nezha 和 Komari 可以同时运行吗？

A: **不可以**。项目已完全迁移到 Komari，不再支持 Nezha。

### Q3: 我的旧 UUID 还能用吗？

A: ✅ **可以**！UUID 机制完全兼容，可以继续使用旧的 UUID。

### Q4: 需要重新部署应用吗？

A: 需要。因为代码已更新，必须：
- Railway：会自动重新部署
- Docker：需要拉取新镜像并重启容器

### Q5: 配置格式必须是 `server:port` 吗？

A: ✅ **是的**！Komari 要求服务器地址必须包含端口，格式：
```bash
# 正确 ✅
KOMARI_SERVER=monitor.com:5555
KOMARI_SERVER=192.168.1.100:8080

# 错误 ❌
KOMARI_SERVER=monitor.com
KOMARI_SERVER=monitor.com
KOMARI_PORT=5555  # 不再支持单独的端口变量
```

### Q6: TLS 怎么配置？

A: **自动检测**！不需要手动配置。

根据端口号自动判断：
- `443`, `8443`, `2096`, `2087`, `2083`, `2053` → 启用 TLS
- 其他端口 → 不启用 TLS

### Q7: 迁移后监控历史数据会丢失吗？

A: 是的，因为这是完全不同的监控系统。但你可以：
- 导出 Nezha 的历史数据（如果支持）
- 在 Komari 中重新开始记录

### Q8: Agent 二进制文件从哪里下载？

A: 自动从以下地址下载（根据架构）：
- AMD64: `https://amd64.ssss.nyc.mn/komari`
- ARM64: `https://arm64.ssss.nyc.mn/komari`

无需手动下载！

## ⚡ 快速参考

### 端口对应表

如果你的 Nezha 使用特定端口，这里是 Komari 的对应配置：

| Nezha 配置 | Komari 配置 | 说明 |
|-----------|------------|------|
| `SERVER=x.com PORT=5555` | `SERVER=x.com:5555` | 标准端口 |
| `SERVER=x.com:8008 PORT=` | `SERVER=x.com:8008` | v1 格式 |
| `SERVER=x.com PORT=443` | `SERVER=x.com:443` | 自动启用 TLS |

### 变量重命名对照

| Nezha | Komari | 变化 |
|-------|--------|------|
| `NEZHA_SERVER` | `KOMARI_SERVER` | ✏️ 改名，格式包含端口 |
| `NEZHA_PORT` | ~~删除~~ | ❌ 不再需要 |
| `NEZHA_KEY` | `KOMARI_KEY` | ✏️ 改名 |
| `UUID` | `UUID` | ✅ 不变 |
| `NAME` | `NAME` | ✅ 不变 |

## 🎯 迁移清单

打印这个清单，逐项完成：

- [ ] 备份当前环境变量配置
- [ ] 记录当前 UUID（继续使用）
- [ ] 获取 Komari 服务器地址和密钥
- [ ] 删除 `NEZHA_SERVER` 变量
- [ ] 删除 `NEZHA_PORT` 变量
- [ ] 删除 `NEZHA_KEY` 变量
- [ ] 添加 `KOMARI_SERVER` 变量（格式：server:port）
- [ ] 添加 `KOMARI_KEY` 变量
- [ ] 重新部署应用
- [ ] 检查部署日志（确认 Komari agent 启动）
- [ ] 访问 Komari 面板（确认节点在线）
- [ ] 测试订阅功能（访问 /sub）
- [ ] 测试健康检查（访问 /）
- [ ] 删除旧的 Nezha 节点（如需要）

## 📞 需要帮助？

如果迁移过程中遇到问题：

1. **检查日志**：最常见的问题都能在日志中找到线索
2. **验证格式**：确保 `KOMARI_SERVER` 包含端口号
3. **测试连接**：`telnet your-server.com 5555`
4. **查看文档**：[KOMARI_USAGE.md](./KOMARI_USAGE.md)
5. **提交 Issue**：附上日志信息

---

**祝你迁移顺利！** 🎉

记住：**操作流程和哪吒一样，只是变量名不同！**

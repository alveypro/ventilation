# 呼吸机之家 - 完整部署与运维指南

## 📋 项目概述

**呼吸机之家** 是一个专业的呼吸机选购、使用指南与医学知识库平台。系统包含：
- 🏠 **首页**：快速导航与热门内容
- 🛍️ **产品库**：呼吸机产品浏览与详情
- 🏪 **品牌库**：全球品牌介绍
- 📊 **测评中心**：产品测评与用户评价
- 🔄 **产品对比**：多款产品对比工具
- 📚 **疾病指南**：OSA/COPD/心衰等疾病知识
- 🎓 **使用教程**：呼吸机使用方法与护理
- 🤖 **智能选机**：AI 推荐系统
- 👨‍⚕️ **医生中心**：专业医学知识库与诊疗指南
- 👤 **患者中心**：患者教育与生活管理

---

## 🚀 快速启动

### 本地前端开发

```bash
# 1. 安装依赖
cd /Users/mac/ventilation
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器打开
http://localhost:5173
```

### 本地后端开发

```bash
# 1. 进入后端目录
cd /Users/mac/ventilation/backend

# 2. 安装依赖
npm install

# 3. 配置环境变量（创建 .env 文件）
cat > .env << EOF
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ventilation
JWT_SECRET=your-secret-key-change-in-production
EOF

# 4. 启动 MongoDB（使用 Docker）
docker run -d -p 27017:27017 --name mongo mongo:latest

# 5. 启动后端服务
npm run dev

# 6. 后端运行于 http://localhost:3000
```

---

## 🐳 Docker Compose 部署（完整栈）

### 一键启动完整系统

```bash
# 1. 进入项目根目录
cd /Users/mac/ventilation

# 2. 启动所有服务（前端 + 后端 + MongoDB）
docker-compose up -d

# 3. 查看状态
docker-compose ps

# 4. 访问应用
# 前端: http://localhost:5173
# 后端 API: http://localhost:3000
# MongoDB: localhost:27017
```

### 停止与清理

```bash
# 停止所有服务
docker-compose down

# 删除所有容器与数据卷
docker-compose down -v

# 查看日志
docker-compose logs -f frontend
docker-compose logs -f api
docker-compose logs -f mongo
```

---

## 📦 生产环境构建

### 前端构建

```bash
# 1. 构建优化版本
cd /Users/mac/ventilation
npm run build

# 2. 预览构建结果
npm run preview

# 3. 部署到服务器
# 将 dist/ 文件夹部署到 Nginx 或其他静态服务器
```

### 后端构建与部署

```bash
# 1. 编译 TypeScript
cd backend
npm run build

# 2. 启动生产服务器
NODE_ENV=production npm start

# 或使用 PM2 进程管理
pm2 start dist/server.js --name "ventilation-api"
pm2 save
```

---

## 🛠️ 故障排查

### 问题 1：医生中心/患者中心不显示

**症状**：首页快速入口或菜单中看不到医生中心/患者中心

**解决步骤**：
1. 检查路由配置：
   ```bash
   grep -n "doctor\|patient" src/router/index.ts
   ```
2. 检查菜单配置：
   ```bash
   grep -n "doctor\|patient" src/App.vue
   ```
3. 检查 Home.vue 快速入口：
   ```bash
   grep -n "医生中心\|患者中心" src/views/Home.vue
   ```
4. 清除浏览器缓存并硬刷新（Ctrl+Shift+R 或 Cmd+Shift+R）

### 问题 2：端口被占用

**症状**：`Port 5173 is in use` 错误

**解决**：
```bash
# 查找占用的进程
lsof -i :5173

# 杀死进程（macOS）
kill -9 <PID>

# 或更换端口启动
npm run dev -- --port 3333
```

### 问题 3：MongoDB 连接失败

**症状**：`MongoServerError: connect ECONNREFUSED`

**解决**：
```bash
# 使用 Docker 启动 MongoDB
docker run -d -p 27017:27017 --name mongo mongo:latest

# 或使用本地 MongoDB
brew services start mongodb-community
```

### 问题 4：后端依赖冲突

**症状**：`npm ERR! notarget No matching version found`

**解决**：
```bash
# 更新 package.json 中的版本（如 jsonwebtoken）
cd backend
npm update

# 或清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 5：TypeScript 编译错误

**症状**：`npm run build` 失败

**解决**：
```bash
# 检查 TypeScript 版本
npm list typescript

# 更新 TypeScript
npm update typescript

# 清除构建缓存
rm -rf dist
npm run build
```

---

## 📝 环境变量配置

### 前端环境变量 (`.env` 或 `vite.config.ts`)

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:3000/api')
  }
})
```

### 后端环境变量 (`.env`)

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ventilation
JWT_SECRET=your-secret-key-here-min-32-chars-for-prod
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
```

---

## 🔒 安全建议（生产环境）

1. **环境变量保护**：不要提交 `.env` 到 Git
2. **HTTPS 启用**：使用 SSL 证书
3. **JWT 密钥**：生成强密钥（最少 32 字符）
4. **CORS 配置**：限制允许的域名
5. **数据库备份**：定期备份 MongoDB 数据
6. **日志记录**：使用 Winston 或 Bunyan
7. **速率限制**：防止 API 滥用
8. **输入验证**：验证所有用户输入

---

## 📊 监控与日志

### 前端监控

```bash
# 启用详细日志
# src/utils/logger.ts
export const logger = {
  log: (msg, data) => console.log(`[${new Date().toISOString()}] ${msg}`, data),
  error: (msg, err) => console.error(`[ERROR] ${msg}`, err)
}
```

### 后端监控（PM2）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start dist/server.js --name "ventilation-api"

# 查看实时日志
pm2 monit

# 查看日志
pm2 logs ventilation-api
```

---

## 🎯 推荐工作流

### 开发流程

```bash
# 1. 创建特性分支
git checkout -b feature/doctor-section-optimization

# 2. 启动开发服务器
npm run dev

# 3. 进行代码修改和测试
# ...

# 4. 提交代码
git add .
git commit -m "feat: optimize doctor section display"

# 5. 推送并创建 Pull Request
git push origin feature/doctor-section-optimization
```

### 发布流程

```bash
# 1. 更新版本
npm version patch  # 或 minor / major

# 2. 构建
npm run build

# 3. 标记发布
git tag v2.0.1

# 4. 部署到生产
# 根据你的部署方案执行相应命令
```

---

## 📞 技术支持

- **文档**：查看各 `README.md` 和本指南
- **代码注释**：所有核心功能都有详细注释
- **日志输出**：启用详细日志进行调试

---

**最后更新**：2026年1月9日

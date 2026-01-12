# 呼吸机之家 API 服务

基于 Node.js + Express + MongoDB 的专业呼吸机平台后端服务。

## 技术栈

- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MongoDB
- **认证**: JWT + bcryptjs
- **运行时**: Node.js

## 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 环境配置

复制 `.env.example` 为 `.env` 并配置：

\`\`\`bash
cp .env.example .env
\`\`\`

### 开发模式

\`\`\`bash
npm run dev
\`\`\`

服务器将在 \`http://localhost:3000\` 启动

### 构建生产版本

\`\`\`bash
npm run build
npm start
\`\`\`

## API 文档

### 产品 API

- \`GET /api/products\` - 获取所有产品
- \`GET /api/products/:id\` - 获取单个产品
- \`POST /api/products\` - 创建产品 (需认证)
- \`PUT /api/products/:id\` - 更新产品 (需认证)
- \`DELETE /api/products/:id\` - 删除产品 (需认证)

### 测评 API

- \`GET /api/reviews\` - 获取所有测评
- \`GET /api/reviews/:id\` - 获取单个测评
- \`POST /api/reviews\` - 创建测评 (需认证)
- \`PUT /api/reviews/:id\` - 更新测评 (需认证)
- \`DELETE /api/reviews/:id\` - 删除测评 (需认证)

### 用户 API

- \`POST /api/users/register\` - 注册用户
- \`POST /api/users/login\` - 登录用户
- \`GET /api/users/me\` - 获取当前用户 (需认证)

### 疾病指南 API

- \`GET /api/diseases\` - 获取所有疾病指南
- \`GET /api/diseases/:id\` - 获取单个疾病指南

### 教程 API

- \`GET /api/tutorials\` - 获取所有教程
- \`GET /api/tutorials/:id\` - 获取单个教程

## 项目结构

\`\`\`
src/
├── server.ts              # 应用入口
├── config/                # 配置文件
│   └── database.ts
├── middleware/            # 中间件
│   ├── auth.ts
│   └── errorHandler.ts
├── models/                # 数据模型
│   ├── Product.ts
│   ├── Review.ts
│   └── User.ts
├── routes/                # 路由
│   ├── products.ts
│   ├── reviews.ts
│   ├── users.ts
│   ├── diseases.ts
│   └── tutorials.ts
└── types/                 # TypeScript 类型
\`\`\`

## 认证

API 使用 JWT 令牌进行认证。在请求头中添加：

\`\`\`
Authorization: Bearer <token>
\`\`\`

## 错误处理

所有 API 响应遵循统一格式：

\`\`\`json
{
  "code": 200,
  "message": "Success",
  "data": {}
}
\`\`\`

错误响应：

\`\`\`json
{
  "code": 400,
  "message": "Error message"
}
\`\`\`

## 许可证

MIT

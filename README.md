# 呼吸机之家 v2.0

一个专业的呼吸机选购与使用指南平台，采用现代化技术栈。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI库**: Element Plus
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios

## 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 开发模式

\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

### 预览构建结果

\`\`\`bash
npm run preview
\`\`\`

## 项目结构

\`\`\`
src/
├── main.ts              # 应用入口
├── App.vue              # 根组件
├── router/              # 路由配置
├── stores/              # Pinia 状态管理
├── views/               # 页面组件
├── components/          # 可复用组件
├── types/               # TypeScript 类型定义
├── services/            # API 服务
├── styles/              # 全局样式
└── utils/               # 工具函数
\`\`\`

## 功能清单

- [x] 项目工程化配置
- [x] Vue 3 + TypeScript 迁移
- [x] 百科中心与全站搜索
- [x] 代理商中心与厂家中心
- [x] 循证标签、双语解读、循证来源与知识包下载
- [x] PDF 模板（可打印为PDF）
- [x] 红皮书榜单与权威徽章体系
- [ ] 后端 API 搭建
- [ ] 数据库集成
- [ ] 用户认证系统
- [ ] 产品详情页面
- [ ] 购物车功能
- [ ] 用户评价系统
- [ ] 响应式设计优化
- [ ] 单元测试
- [ ] E2E 测试
- [ ] CI/CD 部署

## 开发计划

### Phase 1: 核心功能
- 完成所有页面组件
- 集成数据数据

### Phase 2: 后端与数据库
- Node.js/Express 后端
- MongoDB/PostgreSQL 数据库
- RESTful API

### Phase 3: 用户系统
- 用户注册/登录
- 个人中心
- 收藏和购物车

### Phase 4: 优化与部署
- 性能优化
- SEO 优化
- Docker 部署

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT

## 完整部署与运维指南

详见 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

- 包含本地开发、后端启动、Docker Compose 一键部署、常见故障排查、环境变量配置、生产安全建议等内容。
- 首页、医生中心、患者中心等所有模块已优化，卡片入口在所有设备上均可见。
- 如遇医生/患者中心不显示，请参考指南中的故障排查部分。

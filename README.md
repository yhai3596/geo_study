# GEO学习平台

一个基于React + TypeScript + Vite构建的地理信息系统(GIS)学习平台，提供全面的GIS学习资源、案例研究和实用工具。

## 项目特性

- 🎯 **学习路径**: 结构化的GIS学习路径
- 📚 **丰富资源**: 包含教程、案例研究、工具模板
- 🛠️ **实用工具**: GIS分析工具和模板
- 📊 **数据可视化**: 交互式图表和地图展示
- 📱 **响应式设计**: 支持桌面和移动设备

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: React Context
- **路由**: React Router
- **代码规范**: ESLint + TypeScript

## 开发环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

## 安装和运行

### 1. 克隆项目

```bash
git clone https://github.com/yhai3596/geo_study.git
cd geo_study
```

### 2. 安装依赖

**重要**: 本项目统一使用 npm 作为包管理器，请勿使用 yarn 或 pnpm。

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 4. 构建生产版本

```bash
npm run build
```

### 5. 预览生产版本

```bash
npm run preview
```

## 包管理器说明

为了确保依赖版本一致性和避免部署冲突，本项目严格要求：

- ✅ **使用 npm**: `npm install`, `npm run dev`
- ❌ **禁用 pnpm**: 避免与部署环境冲突
- ❌ **禁用 yarn**: 保持依赖锁文件统一

如果您之前使用了其他包管理器，请：

1. 删除 `pnpm-lock.yaml` 或 `yarn.lock`
2. 删除 `node_modules` 目录
3. 运行 `npm install` 重新安装

## Vercel部署

本项目已配置为可直接在Vercel上部署。

### 自动部署（推荐）

1. 将代码推送到GitHub仓库
2. 访问 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入GitHub仓库 `https://github.com/yhai3596/geo_study`
5. Vercel会自动检测为Vite项目并配置构建设置
6. 点击 "Deploy" 开始部署

### 部署配置

Vercel会自动使用以下配置：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 环境变量

如需配置环境变量，在Vercel项目设置中添加：

```
NODE_ENV=production
```

### 自定义域名

部署完成后，您可以在Vercel项目设置中配置自定义域名。

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── layout/         # 布局组件
│   └── ErrorBoundary.tsx
├── pages/              # 页面组件
│   ├── HomePage.tsx
│   ├── LearningPathsPage.tsx
│   ├── ResourcesPage.tsx
│   ├── CaseStudiesPage.tsx
│   ├── ToolsPage.tsx
│   └── ProfilePage.tsx
├── contexts/           # React Context
├── hooks/              # 自定义Hooks
├── lib/                # 工具函数
└── App.tsx             # 主应用组件

public/
├── data/               # 静态数据文件
│   ├── learning_guides/
│   ├── case_studies/
│   ├── charts/
│   ├── learning_resources/
│   └── tools_templates/
└── images/             # 图片资源
```

## 开发指南

### 代码规范

```bash
# 检查代码规范
npm run lint

# 自动修复代码格式
npm run lint:fix
```

### 类型检查

```bash
# TypeScript类型检查
npm run type-check
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系方式

- 项目仓库: https://github.com/yhai3596/geo_study
- 问题反馈: [Issues](https://github.com/yhai3596/geo_study/issues)

---

**注意**: 部署前请确保使用npm作为包管理器，避免与Vercel的构建环境产生冲突。

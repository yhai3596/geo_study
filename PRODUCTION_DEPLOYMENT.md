# GEO学习平台 - 生产部署指南

本指南将详细介绍如何将GEO学习平台部署到生产环境，包括Supabase配置、Vercel部署、域名设置、安全配置等完整流程。

## 📋 部署前检查清单

### 必需准备
- [ ] GitHub账号和代码仓库
- [ ] Supabase账号
- [ ] Vercel账号
- [ ] 域名（可选，用于自定义域名）
- [ ] 邮箱服务配置（用于用户认证）

### 代码准备
- [ ] 代码已推送到GitHub主分支
- [ ] 所有测试通过 (`npm test`)
- [ ] 代码规范检查通过 (`npm run lint`)
- [ ] TypeScript类型检查通过 (`npm run type-check`)
- [ ] 生产构建成功 (`npm run build`)

## 🗄️ 第一步：Supabase生产环境配置

### 1.1 创建生产Supabase项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 配置项目信息：
   ```
   项目名称: geo-learning-platform-prod
   组织: 选择你的组织
   数据库密码: 使用强密码（建议使用密码管理器生成）
   地区: 选择离目标用户最近的地区
   ```
4. 点击 "Create new project"
5. 等待项目初始化完成（通常需要2-3分钟）

### 1.2 配置数据库

1. 在Supabase Dashboard中，进入 "SQL Editor"
2. 创建新查询，复制并执行 `database/schema.sql` 中的内容：

```sql
-- 用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  progress DECIMAL(5,2) DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- 启用行级安全策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON learning_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);
```

### 1.3 配置认证设置

1. 进入 "Authentication" → "Settings"
2. 配置站点URL：
   ```
   Site URL: https://your-domain.com
   ```
3. 配置重定向URL：
   ```
   Redirect URLs:
   https://your-domain.com
   https://your-domain.com/auth/callback
   ```
4. 启用邮箱认证：
   - 确保 "Email" 提供商已启用
   - 配置邮箱模板（可选）

### 1.4 配置SMTP邮件服务（推荐）

为了获得更好的邮件送达率，建议配置自定义SMTP：

1. 进入 "Settings" → "Auth" → "SMTP Settings"
2. 启用 "Enable custom SMTP"
3. 配置SMTP信息：
   ```
   SMTP Host: smtp.your-provider.com
   SMTP Port: 587
   SMTP User: your-email@domain.com
   SMTP Pass: your-app-password
   Sender Name: GEO学习平台
   Sender Email: noreply@your-domain.com
   ```

### 1.5 获取生产环境密钥

1. 进入 "Settings" → "API"
2. 复制以下信息：
   ```
   Project URL: https://your-project-id.supabase.co
   anon public key: eyJ...
   service_role key: eyJ... (仅在需要服务端操作时使用)
   ```

## 🚀 第二步：Vercel部署配置

### 2.1 连接GitHub仓库

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择你的GitHub仓库
5. 配置项目设置：
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### 2.2 配置环境变量

在Vercel项目设置中添加环境变量：

1. 进入项目 "Settings" → "Environment Variables"
2. 添加以下变量：

```bash
# 生产环境标识
NODE_ENV=production

# Supabase配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# 应用配置
VITE_APP_NAME=GEO学习平台
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://your-domain.com
```

### 2.3 配置构建设置

1. 确保 `vercel.json` 配置正确：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;"
        }
      ]
    }
  ]
}
```

### 2.4 部署项目

1. 点击 "Deploy" 开始部署
2. 等待构建完成（通常需要2-5分钟）
3. 部署成功后，Vercel会提供一个临时域名

## 🌐 第三步：域名和SSL配置

### 3.1 配置自定义域名（可选）

1. 在Vercel项目中，进入 "Settings" → "Domains"
2. 点击 "Add Domain"
3. 输入你的域名：`your-domain.com`
4. 按照提示配置DNS记录：
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
5. 等待DNS传播（通常需要几分钟到几小时）

### 3.2 SSL证书

Vercel会自动为你的域名配置SSL证书，无需手动操作。

### 3.3 更新Supabase配置

域名配置完成后，需要更新Supabase中的URL配置：

1. 回到Supabase Dashboard
2. 进入 "Authentication" → "Settings"
3. 更新Site URL和Redirect URLs为你的正式域名

## 🔒 第四步：安全配置

### 4.1 环境变量安全

- ✅ 确保所有敏感信息都通过环境变量配置
- ✅ 不要在代码中硬编码任何密钥
- ✅ 定期轮换API密钥
- ✅ 使用不同的密钥用于开发和生产环境

### 4.2 Supabase安全设置

1. **启用行级安全策略（RLS）**：
   - 确保所有表都启用了RLS
   - 创建适当的安全策略

2. **API密钥管理**：
   - 仅使用anon key用于客户端
   - 保护service_role key，仅在服务端使用

3. **数据库访问控制**：
   - 定期审查数据库访问日志
   - 设置适当的用户权限

### 4.3 应用安全

1. **内容安全策略（CSP）**：
   - 已在vercel.json中配置基本CSP
   - 根据需要调整策略

2. **HTTPS强制**：
   - Vercel自动强制HTTPS
   - 确保所有外部资源也使用HTTPS

## 📊 第五步：监控和日志

### 5.1 Vercel Analytics

1. 在Vercel项目中启用Analytics
2. 进入 "Analytics" 查看访问统计

### 5.2 Supabase监控

1. 在Supabase Dashboard中查看：
   - Database usage
   - API requests
   - Authentication metrics

### 5.3 错误监控

考虑集成错误监控服务：
- Sentry
- LogRocket
- Bugsnag

## 🧪 第六步：部署后测试

### 6.1 功能测试

- [ ] 用户注册和登录
- [ ] 学习进度同步
- [ ] 数据迁移功能
- [ ] 所有页面正常加载
- [ ] 响应式设计在各设备上正常

### 6.2 性能测试

使用以下工具测试性能：
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### 6.3 安全测试

- [ ] SSL证书正常工作
- [ ] 安全头部正确设置
- [ ] 无敏感信息泄露

## 🔄 第七步：CI/CD自动部署

### 7.1 GitHub Actions配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### 7.2 配置GitHub Secrets

在GitHub仓库设置中添加：
- `VERCEL_TOKEN`
- `ORG_ID`
- `PROJECT_ID`

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查依赖
   npm ci
   npm run build
   
   # 检查TypeScript错误
   npm run type-check
   ```

2. **环境变量未生效**
   - 确保变量名以 `VITE_` 开头
   - 重新部署项目
   - 检查Vercel环境变量配置

3. **Supabase连接失败**
   - 检查URL和密钥是否正确
   - 确认网络连接
   - 查看浏览器控制台错误

4. **认证问题**
   - 检查Supabase认证设置
   - 确认Site URL配置正确
   - 检查邮件服务配置

### 日志查看

1. **Vercel日志**：
   - 在Vercel Dashboard的Functions标签页查看

2. **Supabase日志**：
   - 在Supabase Dashboard的Logs标签页查看

3. **浏览器日志**：
   - 打开开发者工具查看控制台错误

## 📝 维护建议

### 定期任务

- [ ] 每月检查依赖更新
- [ ] 每季度审查安全设置
- [ ] 定期备份数据库
- [ ] 监控性能指标
- [ ] 更新文档

### 版本管理

- 使用语义化版本号
- 维护CHANGELOG.md
- 创建发布标签
- 保留稳定版本分支

## 📞 支持和联系

如果在部署过程中遇到问题：

1. 查看项目文档
2. 检查GitHub Issues
3. 联系技术支持

---

**部署完成后，你的GEO学习平台就可以为用户提供服务了！** 🎉

记住定期更新和维护，确保平台的安全性和性能。
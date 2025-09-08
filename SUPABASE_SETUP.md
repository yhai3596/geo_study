# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并注册账号
2. 点击 "New Project" 创建新项目
3. 选择组织，输入项目名称（如：geo-learning-platform）
4. 设置数据库密码（请记住此密码）
5. 选择地区（建议选择离用户最近的地区）
6. 点击 "Create new project"

## 2. 获取项目配置信息

项目创建完成后：

1. 在项目仪表板中，点击左侧菜单的 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (很长的字符串)

## 3. 配置环境变量

1. 在项目根目录创建 `.env` 文件（基于 `.env.example`）：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 Supabase 配置：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. 创建数据库表

1. 在 Supabase 仪表板中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `database/schema.sql` 文件的内容到查询编辑器
4. 点击 "Run" 执行 SQL 脚本

## 5. 配置认证设置

1. 在 Supabase 仪表板中，点击左侧菜单的 "Authentication" → "Settings"
2. 在 "Site URL" 中添加你的应用 URL：
   - 开发环境：`http://localhost:5173`
   - 生产环境：你的域名
3. 在 "Redirect URLs" 中添加相同的 URL

## 6. 启用邮箱认证（可选）

如果需要邮箱验证功能：

1. 在 "Authentication" → "Settings" → "Auth Providers" 中
2. 确保 "Email" 提供商已启用
3. 配置 SMTP 设置（或使用 Supabase 的默认邮件服务）

## 7. 测试连接

完成配置后，重启开发服务器：

```bash
npm run dev
```

如果配置正确，应用应该能够正常连接到 Supabase。

## 故障排除

### 常见问题

1. **"Missing Supabase environment variables" 错误**
   - 检查 `.env` 文件是否存在且配置正确
   - 确保环境变量名称以 `VITE_` 开头

2. **数据库连接失败**
   - 检查 Project URL 是否正确
   - 确认 anon key 是否正确复制

3. **认证失败**
   - 检查 Site URL 和 Redirect URLs 配置
   - 确认数据库表已正确创建

### 有用的链接

- [Supabase 文档](https://supabase.com/docs)
- [Supabase React 教程](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)
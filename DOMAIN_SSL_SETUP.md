# 🌐 域名和SSL证书配置指南

本指南将帮助你为GEO学习平台配置自定义域名和SSL证书，提升品牌形象和用户信任度。

## 🎯 配置目标

- 设置自定义域名（如：geo-learning.com）
- 自动配置SSL证书
- 设置域名重定向
- 配置子域名（如：api.geo-learning.com）
- 优化SEO和性能

## 📋 前置要求

### 1. 域名准备
- 已购买域名（推荐注册商：Namecheap、GoDaddy、阿里云等）
- 有域名管理权限
- 了解DNS基础知识

### 2. Vercel项目
- 项目已部署到Vercel
- 有Vercel项目管理权限
- 项目运行正常

## 🔧 Vercel域名配置

### 步骤1：添加自定义域名

1. **登录Vercel Dashboard**
   - 访问 [vercel.com](https://vercel.com)
   - 选择你的项目

2. **进入域名设置**
   ```
   Project → Settings → Domains
   ```

3. **添加域名**
   ```
   输入域名：geo-learning.com
   点击 "Add"
   ```

4. **配置域名类型**
   - **主域名**: `geo-learning.com`
   - **www域名**: `www.geo-learning.com`
   - **子域名**: `app.geo-learning.com`（可选）

### 步骤2：DNS配置

#### 方案A：使用A记录（推荐）

在你的域名注册商DNS设置中添加：

```dns
# 主域名
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600

# www子域名
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### 方案B：使用CNAME记录

```dns
# 主域名（如果支持CNAME flattening）
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600

# www子域名
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### 子域名配置

```dns
# API子域名
Type: CNAME
Name: api
Value: cname.vercel-dns.com
TTL: 3600

# 管理后台子域名
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 3600
```

### 步骤3：验证域名

1. **等待DNS传播**
   - 通常需要5-30分钟
   - 最长可能需要48小时

2. **检查DNS传播**
   ```bash
   # 使用nslookup检查
   nslookup geo-learning.com
   
   # 使用在线工具
   # https://www.whatsmydns.net/
   ```

3. **Vercel自动验证**
   - Vercel会自动检测DNS配置
   - 验证成功后显示绿色勾号

## 🔒 SSL证书配置

### 自动SSL（推荐）

Vercel自动为所有自定义域名提供免费SSL证书：

1. **Let's Encrypt证书**
   - 自动申请和续期
   - 支持通配符证书
   - 无需手动配置

2. **证书状态检查**
   ```
   Project → Settings → Domains
   查看SSL状态："Issued" 表示成功
   ```

3. **强制HTTPS**
   ```json
   // vercel.json
   {
     "redirects": [
       {
         "source": "http://geo-learning.com/:path*",
         "destination": "https://geo-learning.com/:path*",
         "permanent": true
       },
       {
         "source": "http://www.geo-learning.com/:path*",
         "destination": "https://www.geo-learning.com/:path*",
         "permanent": true
       }
     ]
   }
   ```

### 自定义SSL证书（高级）

如果需要使用自己的SSL证书：

1. **上传证书**
   ```
   Project → Settings → Domains → Custom Certificate
   ```

2. **证书要求**
   - PEM格式
   - 包含完整证书链
   - 私钥文件
   - 支持的域名

## 🔄 域名重定向配置

### 1. WWW重定向

```json
// vercel.json
{
  "redirects": [
    {
      "source": "https://www.geo-learning.com/:path*",
      "destination": "https://geo-learning.com/:path*",
      "permanent": true
    }
  ]
}
```

### 2. 旧域名重定向

```json
// vercel.json
{
  "redirects": [
    {
      "source": "https://old-domain.com/:path*",
      "destination": "https://geo-learning.com/:path*",
      "permanent": true
    }
  ]
}
```

### 3. 子域名重定向

```json
// vercel.json
{
  "redirects": [
    {
      "source": "https://blog.geo-learning.com/:path*",
      "destination": "https://geo-learning.com/blog/:path*",
      "permanent": true
    }
  ]
}
```

## 🌍 多域名配置

### 国际化域名

```json
// vercel.json
{
  "redirects": [
    {
      "source": "https://geo-learning.cn/:path*",
      "destination": "https://geo-learning.com/zh/:path*",
      "permanent": false
    },
    {
      "source": "https://geo-learning.jp/:path*",
      "destination": "https://geo-learning.com/ja/:path*",
      "permanent": false
    }
  ]
}
```

### 环境特定域名

```json
// vercel.json
{
  "redirects": [
    {
      "source": "https://staging.geo-learning.com/:path*",
      "destination": "https://geo-learning-staging.vercel.app/:path*",
      "permanent": false
    }
  ]
}
```

## 📊 域名性能优化

### 1. DNS优化

```dns
# 使用较短的TTL进行测试
TTL: 300 (5分钟)

# 生产环境使用较长TTL
TTL: 3600 (1小时) 或 86400 (24小时)
```

### 2. CDN配置

Vercel自动提供全球CDN：

- **边缘节点**: 全球100+节点
- **智能路由**: 自动选择最近节点
- **缓存优化**: 静态资源自动缓存

### 3. 预加载配置

```html
<!-- 在index.html中添加 -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//api.geo-learning.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

## 🔍 域名监控

### 1. SSL证书监控

```typescript
// src/lib/sslMonitor.ts
export class SSLMonitor {
  static async checkSSLExpiry(domain: string) {
    try {
      const response = await fetch(`https://${domain}`, { method: 'HEAD' });
      const cert = response.headers.get('ssl-cert-expiry');
      
      if (cert) {
        const expiryDate = new Date(cert);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 30) {
          console.warn(`SSL certificate expires in ${daysUntilExpiry} days`);
        }
        
        return { status: 'valid', daysUntilExpiry };
      }
    } catch (error) {
      console.error('SSL check failed:', error);
      return { status: 'error', error: error.message };
    }
  }
}
```

### 2. 域名可用性监控

```typescript
// src/lib/domainMonitor.ts
export class DomainMonitor {
  static async checkDomainHealth(domains: string[]) {
    const results = await Promise.all(
      domains.map(async (domain) => {
        try {
          const start = Date.now();
          const response = await fetch(`https://${domain}/health`, {
            method: 'HEAD',
            timeout: 5000
          });
          const responseTime = Date.now() - start;
          
          return {
            domain,
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime,
            statusCode: response.status
          };
        } catch (error) {
          return {
            domain,
            status: 'error',
            error: error.message
          };
        }
      })
    );
    
    return results;
  }
}
```

## 🛠️ 常见问题解决

### 1. DNS传播延迟

**问题**: 域名配置后无法访问

**解决方案**:
```bash
# 清除本地DNS缓存
# Windows
ipconfig /flushdns

# macOS
sudo dscacheutil -flushcache

# Linux
sudo systemctl restart systemd-resolved
```

### 2. SSL证书问题

**问题**: SSL证书未自动签发

**解决方案**:
1. 检查DNS配置是否正确
2. 确保域名指向Vercel
3. 等待24-48小时
4. 联系Vercel支持

### 3. 重定向循环

**问题**: 无限重定向

**解决方案**:
```json
// 检查vercel.json重定向配置
{
  "redirects": [
    {
      "source": "https://www.geo-learning.com/:path*",
      "destination": "https://geo-learning.com/:path*",
      "permanent": true
    }
    // 确保没有相互重定向的规则
  ]
}
```

### 4. 子域名无法访问

**问题**: 子域名返回404

**解决方案**:
1. 确保在Vercel中添加了子域名
2. 检查DNS CNAME记录
3. 验证应用路由配置

## 📋 域名配置检查清单

### 配置前检查
- [ ] 域名已购买并可管理
- [ ] Vercel项目运行正常
- [ ] 了解DNS配置方法

### DNS配置
- [ ] 添加A记录或CNAME记录
- [ ] 配置www子域名
- [ ] 设置合适的TTL值
- [ ] 验证DNS传播

### Vercel配置
- [ ] 在Vercel中添加域名
- [ ] 等待域名验证
- [ ] 检查SSL证书状态
- [ ] 配置重定向规则

### 测试验证
- [ ] 主域名可正常访问
- [ ] www域名重定向正常
- [ ] HTTPS强制跳转
- [ ] SSL证书有效
- [ ] 子域名配置正确

### 性能优化
- [ ] 配置DNS预解析
- [ ] 设置适当的缓存策略
- [ ] 监控域名性能
- [ ] 设置SSL监控

## 🔧 高级配置

### 1. 自定义错误页面

```json
// vercel.json
{
  "errorPage": "error.html",
  "routes": [
    {
      "src": "/.*",
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

### 2. 地理位置重定向

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/zh",
      "permanent": false,
      "has": [
        {
          "type": "header",
          "key": "x-vercel-ip-country",
          "value": "CN"
        }
      ]
    }
  ]
}
```

### 3. API子域名配置

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "https://api.geo-learning.com/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

---

通过遵循这个指南，你可以成功配置自定义域名和SSL证书，提升GEO学习平台的专业形象和用户体验。记住定期监控域名和证书状态，确保服务的持续可用性。
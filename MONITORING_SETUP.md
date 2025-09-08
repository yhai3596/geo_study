# 📊 生产环境监控和日志设置指南

本指南将帮助你为GEO学习平台设置完善的监控和日志系统，确保生产环境的稳定运行。

## 🎯 监控目标

### 关键指标
- **性能指标**: 页面加载时间、API响应时间、资源使用率
- **可用性指标**: 服务正常运行时间、错误率
- **用户体验指标**: 用户活跃度、功能使用情况
- **安全指标**: 异常登录、API滥用、安全事件

## 🔧 Vercel内置监控

### Analytics设置

1. **启用Vercel Analytics**
   ```bash
   # 在Vercel Dashboard中
   Project Settings → Analytics → Enable
   ```

2. **配置Web Vitals监控**
   ```typescript
   // src/lib/analytics.ts
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   function sendToAnalytics(metric: any) {
     // 发送到Vercel Analytics
     if (process.env.NODE_ENV === 'production') {
       console.log('Web Vital:', metric);
       // 可以发送到其他分析服务
     }
   }
   
   export function initWebVitals() {
     getCLS(sendToAnalytics);
     getFID(sendToAnalytics);
     getFCP(sendToAnalytics);
     getLCP(sendToAnalytics);
     getTTFB(sendToAnalytics);
   }
   ```

3. **在应用中集成**
   ```typescript
   // src/main.tsx
   import { initWebVitals } from './lib/analytics';
   
   if (process.env.NODE_ENV === 'production') {
     initWebVitals();
   }
   ```

### 函数监控

1. **查看函数日志**
   - 在Vercel Dashboard → Functions
   - 查看执行时间和错误

2. **设置函数超时**
   ```json
   // vercel.json
   {
     "functions": {
       "app/api/**/*.js": {
         "maxDuration": 30
       }
     }
   }
   ```

## 📈 Supabase监控

### 数据库监控

1. **查看数据库指标**
   - Supabase Dashboard → Reports
   - 监控连接数、查询性能、存储使用

2. **设置使用量警报**
   ```sql
   -- 创建监控视图
   CREATE OR REPLACE VIEW monitoring_stats AS
   SELECT 
     COUNT(*) as total_users,
     COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as new_users_24h,
     COUNT(CASE WHEN last_sign_in_at > NOW() - INTERVAL '24 hours' THEN 1 END) as active_users_24h
   FROM auth.users;
   ```

3. **API使用监控**
   - 监控API请求量
   - 查看认证成功率
   - 跟踪数据库操作

### 实时监控

1. **设置实时订阅监控**
   ```typescript
   // src/lib/monitoring.ts
   import { supabase } from './supabase';
   
   export function setupRealtimeMonitoring() {
     if (process.env.NODE_ENV === 'production') {
       // 监控用户活动
       supabase
         .channel('user-activity')
         .on('postgres_changes', 
           { event: '*', schema: 'public', table: 'learning_progress' },
           (payload) => {
             console.log('Learning progress update:', payload);
           }
         )
         .subscribe();
     }
   }
   ```

## 🚨 错误监控

### Sentry集成（推荐）

1. **安装Sentry**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

2. **配置Sentry**
   ```typescript
   // src/lib/sentry.ts
   import * as Sentry from '@sentry/react';
   import { BrowserTracing } from '@sentry/tracing';
   
   export function initSentry() {
     if (process.env.NODE_ENV === 'production') {
       Sentry.init({
         dsn: process.env.VITE_SENTRY_DSN,
         integrations: [
           new BrowserTracing(),
         ],
         tracesSampleRate: 0.1,
         environment: 'production',
         beforeSend(event) {
           // 过滤敏感信息
           if (event.user) {
             delete event.user.email;
           }
           return event;
         }
       });
     }
   }
   ```

3. **错误边界集成**
   ```typescript
   // src/components/ErrorBoundary.tsx
   import * as Sentry from '@sentry/react';
   
   const ErrorBoundary = Sentry.withErrorBoundary(App, {
     fallback: ({ error, resetError }) => (
       <div className="error-boundary">
         <h2>出现了错误</h2>
         <button onClick={resetError}>重试</button>
       </div>
     ),
     beforeCapture: (scope, error, errorInfo) => {
       scope.setTag('errorBoundary', true);
       scope.setContext('errorInfo', errorInfo);
     }
   });
   ```

### 自定义错误处理

1. **全局错误处理**
   ```typescript
   // src/lib/errorHandler.ts
   export class ErrorHandler {
     static logError(error: Error, context?: any) {
       if (process.env.NODE_ENV === 'production') {
         // 发送到监控服务
         console.error('Application Error:', {
           message: error.message,
           stack: error.stack,
           context,
           timestamp: new Date().toISOString(),
           userAgent: navigator.userAgent,
           url: window.location.href
         });
       } else {
         console.error(error, context);
       }
     }
   
     static handleAsyncError(promise: Promise<any>) {
       return promise.catch(error => {
         this.logError(error);
         throw error;
       });
     }
   }
   ```

2. **API错误监控**
   ```typescript
   // src/lib/apiClient.ts
   import { ErrorHandler } from './errorHandler';
   
   export async function apiCall(url: string, options?: RequestInit) {
     try {
       const response = await fetch(url, options);
       
       if (!response.ok) {
         throw new Error(`API Error: ${response.status} ${response.statusText}`);
       }
       
       return await response.json();
     } catch (error) {
       ErrorHandler.logError(error as Error, { url, options });
       throw error;
     }
   }
   ```

## 📊 性能监控

### Core Web Vitals监控

1. **详细性能指标**
   ```typescript
   // src/lib/performance.ts
   export class PerformanceMonitor {
     static measurePageLoad() {
       if (typeof window !== 'undefined' && 'performance' in window) {
         window.addEventListener('load', () => {
           const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
           
           const metrics = {
             dns: navigation.domainLookupEnd - navigation.domainLookupStart,
             tcp: navigation.connectEnd - navigation.connectStart,
             request: navigation.responseStart - navigation.requestStart,
             response: navigation.responseEnd - navigation.responseStart,
             dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
             load: navigation.loadEventEnd - navigation.loadEventStart,
             total: navigation.loadEventEnd - navigation.navigationStart
           };
           
           console.log('Page Load Metrics:', metrics);
         });
       }
     }
   
     static measureResourceLoad() {
       const observer = new PerformanceObserver((list) => {
         list.getEntries().forEach((entry) => {
           if (entry.duration > 1000) { // 超过1秒的资源
             console.warn('Slow resource:', entry.name, entry.duration);
           }
         });
       });
       
       observer.observe({ entryTypes: ['resource'] });
     }
   }
   ```

### 用户体验监控

1. **用户行为追踪**
   ```typescript
   // src/lib/userTracking.ts
   export class UserTracker {
     static trackPageView(page: string) {
       if (process.env.NODE_ENV === 'production') {
         console.log('Page View:', {
           page,
           timestamp: new Date().toISOString(),
           referrer: document.referrer,
           userAgent: navigator.userAgent
         });
       }
     }
   
     static trackUserAction(action: string, data?: any) {
       if (process.env.NODE_ENV === 'production') {
         console.log('User Action:', {
           action,
           data,
           timestamp: new Date().toISOString(),
           page: window.location.pathname
         });
       }
     }
   }
   ```

## 🔍 日志管理

### 结构化日志

1. **日志格式标准化**
   ```typescript
   // src/lib/logger.ts
   export enum LogLevel {
     DEBUG = 'debug',
     INFO = 'info',
     WARN = 'warn',
     ERROR = 'error'
   }
   
   export class Logger {
     static log(level: LogLevel, message: string, data?: any) {
       const logEntry = {
         level,
         message,
         data,
         timestamp: new Date().toISOString(),
         session: this.getSessionId(),
         user: this.getUserId()
       };
   
       if (process.env.NODE_ENV === 'production') {
         // 发送到日志服务
         this.sendToLogService(logEntry);
       } else {
         console.log(logEntry);
       }
     }
   
     private static getSessionId(): string {
       return sessionStorage.getItem('sessionId') || 'anonymous';
     }
   
     private static getUserId(): string | null {
       // 从认证状态获取用户ID
       return localStorage.getItem('userId');
     }
   
     private static sendToLogService(logEntry: any) {
       // 实现日志发送逻辑
       fetch('/api/logs', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(logEntry)
       }).catch(console.error);
     }
   }
   ```

### 日志聚合

1. **使用LogRocket（可选）**
   ```typescript
   // src/lib/logrocket.ts
   import LogRocket from 'logrocket';
   
   export function initLogRocket() {
     if (process.env.NODE_ENV === 'production' && process.env.VITE_LOGROCKET_APP_ID) {
       LogRocket.init(process.env.VITE_LOGROCKET_APP_ID);
       
       // 识别用户
       LogRocket.identify('user-id', {
         name: 'User Name',
         email: 'user@example.com'
       });
     }
   }
   ```

## 🚨 警报设置

### 关键指标警报

1. **错误率警报**
   ```typescript
   // src/lib/alerts.ts
   export class AlertManager {
     private static errorCount = 0;
     private static errorThreshold = 10;
     private static timeWindow = 5 * 60 * 1000; // 5分钟
   
     static reportError(error: Error) {
       this.errorCount++;
       
       if (this.errorCount >= this.errorThreshold) {
         this.sendAlert('High error rate detected', {
           errorCount: this.errorCount,
           timeWindow: this.timeWindow,
           lastError: error.message
         });
         
         this.errorCount = 0; // 重置计数
       }
       
       // 设置重置定时器
       setTimeout(() => {
         this.errorCount = Math.max(0, this.errorCount - 1);
       }, this.timeWindow);
     }
   
     private static sendAlert(message: string, data: any) {
       // 发送警报到Slack、邮件等
       console.error('ALERT:', message, data);
     }
   }
   ```

### 健康检查

1. **应用健康检查**
   ```typescript
   // src/lib/healthCheck.ts
   export class HealthChecker {
     static async checkHealth() {
       const checks = {
         supabase: await this.checkSupabase(),
         localStorage: this.checkLocalStorage(),
         network: await this.checkNetwork()
       };
   
       const isHealthy = Object.values(checks).every(check => check.status === 'ok');
       
       return {
         status: isHealthy ? 'healthy' : 'unhealthy',
         checks,
         timestamp: new Date().toISOString()
       };
     }
   
     private static async checkSupabase() {
       try {
         const { data, error } = await supabase.from('profiles').select('count').limit(1);
         return { status: 'ok', message: 'Supabase connection successful' };
       } catch (error) {
         return { status: 'error', message: 'Supabase connection failed' };
       }
     }
   
     private static checkLocalStorage() {
       try {
         localStorage.setItem('health-check', 'test');
         localStorage.removeItem('health-check');
         return { status: 'ok', message: 'LocalStorage working' };
       } catch (error) {
         return { status: 'error', message: 'LocalStorage not available' };
       }
     }
   
     private static async checkNetwork() {
       try {
         await fetch('/health', { method: 'HEAD' });
         return { status: 'ok', message: 'Network connection successful' };
       } catch (error) {
         return { status: 'error', message: 'Network connection failed' };
       }
     }
   }
   ```

## 📋 监控仪表板

### 自定义仪表板

1. **创建监控组件**
   ```typescript
   // src/components/MonitoringDashboard.tsx
   import React, { useState, useEffect } from 'react';
   import { HealthChecker } from '../lib/healthCheck';
   
   export function MonitoringDashboard() {
     const [health, setHealth] = useState(null);
     
     useEffect(() => {
       const checkHealth = async () => {
         const healthStatus = await HealthChecker.checkHealth();
         setHealth(healthStatus);
       };
       
       checkHealth();
       const interval = setInterval(checkHealth, 30000); // 每30秒检查
       
       return () => clearInterval(interval);
     }, []);
     
     if (process.env.NODE_ENV !== 'development') {
       return null; // 仅在开发环境显示
     }
     
     return (
       <div className="monitoring-dashboard">
         <h3>系统状态</h3>
         {health && (
           <div>
             <p>状态: {health.status}</p>
             <ul>
               {Object.entries(health.checks).map(([key, check]) => (
                 <li key={key}>
                   {key}: {check.status} - {check.message}
                 </li>
               ))}
             </ul>
           </div>
         )}
       </div>
     );
   }
   ```

## 🔧 配置环境变量

在 `.env.production` 中添加监控相关配置：

```env
# 监控配置
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# 第三方服务
VITE_SENTRY_DSN=your-sentry-dsn
VITE_LOGROCKET_APP_ID=your-logrocket-app-id
VITE_GOOGLE_ANALYTICS_ID=your-ga-id

# 警报配置
VITE_ERROR_THRESHOLD=10
VITE_PERFORMANCE_THRESHOLD=3000
```

## 📊 监控最佳实践

### 1. 监控策略
- 监控关键用户路径
- 设置合理的警报阈值
- 定期审查监控数据
- 建立事件响应流程

### 2. 性能优化
- 监控Core Web Vitals
- 优化资源加载
- 实施缓存策略
- 监控第三方服务

### 3. 安全监控
- 监控异常登录
- 跟踪API滥用
- 检测安全漏洞
- 审计用户权限

### 4. 数据隐私
- 避免记录敏感信息
- 实施数据脱敏
- 遵守GDPR等法规
- 定期清理日志

---

通过实施这些监控和日志策略，你可以确保GEO学习平台在生产环境中的稳定运行，快速发现和解决问题，并持续优化用户体验。
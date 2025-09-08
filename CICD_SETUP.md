# 🔄 CI/CD自动部署流程设置指南

本指南将帮助你为GEO学习平台建立完整的CI/CD自动部署流程，实现代码提交到生产部署的全自动化。

## 🎯 CI/CD目标

### 自动化流程
- **持续集成**: 代码提交后自动运行测试
- **持续部署**: 测试通过后自动部署到生产环境
- **质量保证**: 自动代码质量检查和安全扫描
- **回滚机制**: 部署失败时自动回滚
- **通知机制**: 部署状态实时通知

### 部署策略
- **蓝绿部署**: 零停机时间部署
- **金丝雀发布**: 渐进式功能发布
- **特性分支**: 功能分支预览部署
- **环境隔离**: 开发、测试、生产环境分离

## 🛠️ GitHub Actions配置

### 基础工作流配置

已创建的 `.github/workflows/deploy.yml` 包含以下功能：

```yaml
name: 🚀 Deploy GEO Learning Platform

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    name: 🧪 Test & Quality Check
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        
      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: 📥 Install dependencies
        run: npm ci
        
      - name: 🔍 Lint code
        run: npm run lint
        
      - name: 🔧 Type check
        run: npm run type-check
        
      - name: 🧪 Run tests
        run: npm run test
        
      - name: 🏗️ Build application
        run: npm run build
        
      - name: 📤 Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/
          retention-days: 1

  security:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        
      - name: 🔍 Run dependency audit
        run: npm audit --audit-level=high
        
  deploy:
    name: 🚀 Deploy to Vercel
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        
      - name: 🚀 Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
      - name: 💬 Comment deployment URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createCommitComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              commit_sha: context.sha,
              body: '🚀 Deployed to production: https://geo-learning.com'
            })

  notify:
    name: 📢 Notify
    needs: [deploy]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: 📢 Notify success
        if: needs.deploy.result == 'success'
        run: echo "✅ Deployment successful!"
        
      - name: 📢 Notify failure
        if: needs.deploy.result == 'failure'
        run: echo "❌ Deployment failed!"
```

### 高级工作流配置

#### 1. 多环境部署

```yaml
# .github/workflows/multi-env-deploy.yml
name: 🌍 Multi-Environment Deploy

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]

jobs:
  deploy-preview:
    name: 🔍 Deploy Preview
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 🚀 Deploy Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
          
  deploy-staging:
    name: 🧪 Deploy Staging
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: 🚀 Deploy to Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--target staging'
          
  deploy-production:
    name: 🚀 Deploy Production
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: 🚀 Deploy to Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### 2. 性能测试集成

```yaml
# .github/workflows/performance.yml
name: 🚀 Performance Testing

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # 每天凌晨2点运行

jobs:
  lighthouse:
    name: 🔍 Lighthouse Performance Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: 🔍 Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
          
  load-test:
    name: 📊 Load Testing
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: 📊 Run Artillery Load Test
        run: |
          npm install -g artillery
          artillery quick --count 100 --num 10 https://geo-learning.com
```

#### 3. 安全扫描工作流

```yaml
# .github/workflows/security.yml
name: 🔒 Security Scanning

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1' # 每周一早上6点

jobs:
  dependency-scan:
    name: 🔍 Dependency Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: 🔍 Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          
  code-scan:
    name: 🔍 Code Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: 🔍 Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript
          
      - name: 🔍 Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

## 🔧 GitHub Secrets配置

### 必需的Secrets

在GitHub仓库设置中添加以下Secrets：

```bash
# Vercel配置
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id

# Supabase配置
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# 第三方服务
SNYK_TOKEN=your-snyk-token
SLACK_WEBHOOK_URL=your-slack-webhook

# 监控服务
SENTRY_DSN=your-sentry-dsn
LOGROCKET_APP_ID=your-logrocket-id
```

### 获取Vercel配置信息

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 获取项目信息
vercel link

# 查看项目配置
cat .vercel/project.json
```

## 🌿 分支策略

### Git Flow分支模型

```
main (生产环境)
├── develop (开发环境)
│   ├── feature/user-authentication
│   ├── feature/data-visualization
│   └── feature/learning-modules
├── release/v1.2.0 (发布分支)
└── hotfix/critical-bug-fix (热修复)
```

### 分支保护规则

在GitHub仓库设置中配置：

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "test",
      "security",
      "lint",
      "type-check"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 2,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null
}
```

### 自动化分支管理

```yaml
# .github/workflows/branch-management.yml
name: 🌿 Branch Management

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  auto-assign:
    name: 🤖 Auto Assign Reviewers
    runs-on: ubuntu-latest
    steps:
      - name: 🤖 Auto Assign
        uses: kentaro-m/auto-assign-action@v1.2.5
        with:
          configuration-path: '.github/auto-assign.yml'
          
  auto-label:
    name: 🏷️ Auto Label
    runs-on: ubuntu-latest
    steps:
      - name: 🏷️ Label PR
        uses: actions/labeler@v4
        with:
          configuration-path: '.github/labeler.yml'
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## 📊 部署监控

### 部署状态监控

```typescript
// scripts/deployment-monitor.ts
import { Octokit } from '@octokit/rest';

class DeploymentMonitor {
  private octokit: Octokit;
  
  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }
  
  async checkDeploymentStatus(owner: string, repo: string, sha: string) {
    const { data: deployments } = await this.octokit.repos.listDeployments({
      owner,
      repo,
      sha
    });
    
    for (const deployment of deployments) {
      const { data: statuses } = await this.octokit.repos.listDeploymentStatuses({
        owner,
        repo,
        deployment_id: deployment.id
      });
      
      const latestStatus = statuses[0];
      console.log(`Deployment ${deployment.id}: ${latestStatus.state}`);
      
      if (latestStatus.state === 'failure') {
        await this.handleDeploymentFailure(deployment, latestStatus);
      }
    }
  }
  
  private async handleDeploymentFailure(deployment: any, status: any) {
    // 发送告警通知
    console.error('Deployment failed:', {
      deployment_id: deployment.id,
      environment: deployment.environment,
      description: status.description
    });
    
    // 触发自动回滚（如果配置）
    if (deployment.auto_rollback) {
      await this.triggerRollback(deployment);
    }
  }
  
  private async triggerRollback(deployment: any) {
    // 实现自动回滚逻辑
    console.log('Triggering rollback for deployment:', deployment.id);
  }
}
```

### 部署指标收集

```yaml
# .github/workflows/metrics.yml
name: 📊 Deployment Metrics

on:
  deployment_status:

jobs:
  collect-metrics:
    name: 📊 Collect Deployment Metrics
    runs-on: ubuntu-latest
    steps:
      - name: 📊 Record Deployment Time
        run: |
          echo "Deployment completed at: $(date)"
          echo "Deployment duration: ${{ github.event.deployment.created_at }}"
          
      - name: 📊 Send Metrics to Analytics
        run: |
          curl -X POST "https://api.analytics.com/events" \
            -H "Authorization: Bearer ${{ secrets.ANALYTICS_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{
              "event": "deployment_completed",
              "properties": {
                "environment": "${{ github.event.deployment.environment }}",
                "status": "${{ github.event.deployment_status.state }}",
                "duration": "${{ github.event.deployment.created_at }}"
              }
            }'
```

## 🔄 回滚策略

### 自动回滚配置

```yaml
# .github/workflows/rollback.yml
name: 🔄 Automatic Rollback

on:
  deployment_status:

jobs:
  health-check:
    name: 🏥 Health Check
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - name: 🏥 Check Application Health
        run: |
          sleep 30 # 等待部署完成
          
          # 健康检查
          response=$(curl -s -o /dev/null -w "%{http_code}" https://geo-learning.com/health)
          
          if [ $response -ne 200 ]; then
            echo "Health check failed with status: $response"
            exit 1
          fi
          
          # 性能检查
          load_time=$(curl -w "%{time_total}" -o /dev/null -s https://geo-learning.com)
          
          if (( $(echo "$load_time > 5.0" | bc -l) )); then
            echo "Page load time too slow: ${load_time}s"
            exit 1
          fi
          
      - name: 🔄 Trigger Rollback on Failure
        if: failure()
        run: |
          # 触发回滚部署
          vercel rollback --token=${{ secrets.VERCEL_TOKEN }} --yes
```

### 手动回滚脚本

```bash
#!/bin/bash
# scripts/rollback.sh

set -e

echo "🔄 Starting rollback process..."

# 获取上一个成功的部署
PREVIOUS_DEPLOYMENT=$(vercel ls --token=$VERCEL_TOKEN | grep "Ready" | head -2 | tail -1 | awk '{print $1}')

if [ -z "$PREVIOUS_DEPLOYMENT" ]; then
  echo "❌ No previous deployment found"
  exit 1
fi

echo "📋 Rolling back to deployment: $PREVIOUS_DEPLOYMENT"

# 执行回滚
vercel promote $PREVIOUS_DEPLOYMENT --token=$VERCEL_TOKEN --yes

echo "✅ Rollback completed successfully"

# 发送通知
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-type: application/json' \
  --data '{
    "text": "🔄 Application rolled back to previous version",
    "attachments": [{
      "color": "warning",
      "fields": [{
        "title": "Deployment ID",
        "value": "'$PREVIOUS_DEPLOYMENT'",
        "short": true
      }]
    }]
  }'
```

## 📢 通知集成

### Slack通知

```yaml
# .github/workflows/notifications.yml
name: 📢 Notifications

on:
  deployment_status:
  workflow_run:
    workflows: ["Deploy"]
    types: [completed]

jobs:
  slack-notification:
    name: 📢 Slack Notification
    runs-on: ubuntu-latest
    steps:
      - name: 📢 Send Slack Notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          fields: repo,message,commit,author,action,eventName,ref,workflow
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 邮件通知

```yaml
  email-notification:
    name: 📧 Email Notification
    runs-on: ubuntu-latest
    if: failure()
    steps:
      - name: 📧 Send Email
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 587
          username: ${{ secrets.EMAIL_USERNAME }}
          password: ${{ secrets.EMAIL_PASSWORD }}
          subject: '❌ Deployment Failed - GEO Learning Platform'
          body: |
            Deployment failed for commit ${{ github.sha }}
            
            Repository: ${{ github.repository }}
            Branch: ${{ github.ref }}
            Author: ${{ github.actor }}
            
            Please check the GitHub Actions logs for more details.
          to: team@geo-learning.com
          from: noreply@geo-learning.com
```

## 🔧 本地开发集成

### Pre-commit钩子

```bash
# 安装pre-commit
npm install --save-dev husky lint-staged

# 配置package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,md}": [
      "prettier --write"
    ]
  }
}
```

### 本地CI脚本

```bash
#!/bin/bash
# scripts/local-ci.sh

echo "🚀 Running local CI checks..."

# 代码格式检查
echo "📝 Checking code formatting..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi

# 类型检查
echo "🔧 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed"
  exit 1
fi

# 运行测试
echo "🧪 Running tests..."
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# 构建检查
echo "🏗️ Building application..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ All checks passed!"
```

## 📊 CI/CD指标监控

### 部署频率跟踪

```typescript
// scripts/deployment-analytics.ts
interface DeploymentMetrics {
  frequency: number; // 每天部署次数
  leadTime: number; // 从提交到部署的时间
  failureRate: number; // 部署失败率
  recoveryTime: number; // 故障恢复时间
}

class DeploymentAnalytics {
  async calculateMetrics(timeRange: string): Promise<DeploymentMetrics> {
    const deployments = await this.getDeployments(timeRange);
    
    return {
      frequency: this.calculateDeploymentFrequency(deployments),
      leadTime: this.calculateLeadTime(deployments),
      failureRate: this.calculateFailureRate(deployments),
      recoveryTime: this.calculateRecoveryTime(deployments)
    };
  }
  
  private calculateDeploymentFrequency(deployments: any[]): number {
    const days = this.getDaysInRange();
    return deployments.length / days;
  }
  
  private calculateLeadTime(deployments: any[]): number {
    const leadTimes = deployments.map(d => 
      new Date(d.deployed_at).getTime() - new Date(d.committed_at).getTime()
    );
    return leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length;
  }
  
  private calculateFailureRate(deployments: any[]): number {
    const failures = deployments.filter(d => d.status === 'failure').length;
    return failures / deployments.length;
  }
  
  private calculateRecoveryTime(deployments: any[]): number {
    // 计算从故障到恢复的平均时间
    const incidents = this.getIncidents(deployments);
    const recoveryTimes = incidents.map(i => i.recoveryTime);
    return recoveryTimes.reduce((a, b) => a + b, 0) / recoveryTimes.length;
  }
}
```

## 🔧 故障排除

### 常见CI/CD问题

#### 1. 构建失败

```bash
# 检查Node.js版本
node --version
npm --version

# 清理缓存
npm ci
rm -rf node_modules package-lock.json
npm install

# 检查环境变量
echo $NODE_ENV
echo $VITE_SUPABASE_URL
```

#### 2. 测试失败

```bash
# 运行特定测试
npm test -- --testNamePattern="specific test"

# 查看测试覆盖率
npm run test:coverage

# 调试模式运行测试
npm test -- --verbose
```

#### 3. 部署失败

```bash
# 检查Vercel状态
vercel --version
vercel whoami

# 手动部署测试
vercel --prod

# 查看部署日志
vercel logs
```

### 调试工具

```yaml
# .github/workflows/debug.yml
name: 🐛 Debug Workflow

on:
  workflow_dispatch:
    inputs:
      debug_enabled:
        description: 'Enable debug mode'
        required: false
        default: 'false'

jobs:
  debug:
    name: 🐛 Debug
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: 🐛 Setup tmate session
        if: ${{ github.event.inputs.debug_enabled == 'true' }}
        uses: mxschmitt/action-tmate@v3
        with:
          limit-access-to-actor: true
          
      - name: 🔍 Environment Debug
        run: |
          echo "Node version: $(node --version)"
          echo "NPM version: $(npm --version)"
          echo "Working directory: $(pwd)"
          echo "Environment variables:"
          env | grep -E '^(NODE_|NPM_|VERCEL_|VITE_)' | sort
```

---

## 📋 CI/CD设置检查清单

### GitHub Actions配置
- [ ] 基础部署工作流已创建
- [ ] 多环境部署工作流已配置
- [ ] 安全扫描工作流已设置
- [ ] 性能测试工作流已集成
- [ ] 通知工作流已配置

### Secrets配置
- [ ] VERCEL_TOKEN已设置
- [ ] VERCEL_ORG_ID已配置
- [ ] VERCEL_PROJECT_ID已配置
- [ ] 环境变量已添加
- [ ] 第三方服务密钥已设置

### 分支保护
- [ ] 主分支保护规则已设置
- [ ] 必需状态检查已配置
- [ ] 代码审查要求已启用
- [ ] 管理员强制执行已启用

### 监控和通知
- [ ] 部署状态监控已设置
- [ ] Slack通知已配置
- [ ] 邮件通知已设置
- [ ] 指标收集已启用

### 回滚机制
- [ ] 自动回滚工作流已配置
- [ ] 健康检查已实现
- [ ] 手动回滚脚本已准备
- [ ] 回滚测试已验证

---

通过实施这个完整的CI/CD流程，你可以实现GEO学习平台的自动化部署，提高开发效率，确保代码质量，并减少生产环境的风险。记住定期审查和优化CI/CD流程，以适应项目的发展需求。
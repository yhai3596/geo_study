import React, { useState, useEffect } from 'react'
import { 
  Calculator, 
  CheckSquare, 
  FileText, 
  BarChart3, 
  Download,
  ExternalLink,
  Wrench,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Percent
} from 'lucide-react'

interface ROICalculatorData {
  monthlyTraffic: number
  conversionRate: number
  avgOrderValue: number
  geoImprovement: number
  implementationCost: number
}

const tools = [
  {
    id: 'roi-calculator',
    title: 'GEO ROI计算器',
    description: '计算GEO实施的投资回报率和商业价值',
    icon: Calculator,
    color: 'from-green-500 to-green-600',
    type: 'calculator'
  },
  {
    id: 'implementation-checklist',
    title: 'GEO实施检查清单',
    description: '系统化的GEO实施步骤和检查项目',
    icon: CheckSquare,
    color: 'from-blue-500 to-blue-600',
    type: 'checklist',
    downloadUrl: '/data/tools_templates/implementation_checklists.md'
  },
  {
    id: 'content-templates',
    title: '内容优化模板',
    description: '可直接使用的内容优化模板和示例',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
    type: 'template',
    downloadUrl: '/data/tools_templates/content_optimization_templates.md'
  },
  {
    id: 'performance-evaluator',
    title: '效果评估工具',
    description: '评估和跟踪GEO优化效果的工具',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-600',
    type: 'evaluator',
    downloadUrl: '/data/tools_templates/performance_evaluation_tools.md'
  }
]

const ToolCard = ({ tool, onSelect }: { tool: any; onSelect: (id: string) => void }) => {
  const Icon = tool.icon
  
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (tool.downloadUrl) {
      try {
        const response = await fetch(tool.downloadUrl)
        const text = await response.text()
        const element = document.createElement('a')
        const file = new Blob([text], { type: 'text/markdown' })
        element.href = URL.createObjectURL(file)
        element.download = `${tool.id}.md`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      } catch (error) {
        console.error('下载失败:', error)
      }
    }
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onSelect(tool.id)}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
      <p className="text-gray-600 mb-4">{tool.description}</p>
      
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          tool.type === 'calculator' ? 'bg-green-100 text-green-700' :
          tool.type === 'checklist' ? 'bg-blue-100 text-blue-700' :
          tool.type === 'template' ? 'bg-purple-100 text-purple-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {tool.type === 'calculator' && '计算器'}
          {tool.type === 'checklist' && '检查清单'}
          {tool.type === 'template' && '模板'}
          {tool.type === 'evaluator' && '评估工具'}
        </span>
        
        {tool.downloadUrl && (
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="下载"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

const ROICalculator = () => {
  const [data, setData] = useState<ROICalculatorData>({
    monthlyTraffic: 10000,
    conversionRate: 2.5,
    avgOrderValue: 100,
    geoImprovement: 30,
    implementationCost: 5000
  })
  
  const [results, setResults] = useState({
    currentMonthlyRevenue: 0,
    projectedMonthlyRevenue: 0,
    monthlyIncrease: 0,
    annualIncrease: 0,
    roi: 0,
    paybackPeriod: 0
  })

  React.useEffect(() => {
    const currentMonthlyRevenue = data.monthlyTraffic * (data.conversionRate / 100) * data.avgOrderValue
    const projectedMonthlyRevenue = currentMonthlyRevenue * (1 + data.geoImprovement / 100)
    const monthlyIncrease = projectedMonthlyRevenue - currentMonthlyRevenue
    const annualIncrease = monthlyIncrease * 12
    const roi = ((annualIncrease - data.implementationCost) / data.implementationCost) * 100
    const paybackPeriod = data.implementationCost / monthlyIncrease

    setResults({
      currentMonthlyRevenue,
      projectedMonthlyRevenue,
      monthlyIncrease,
      annualIncrease,
      roi,
      paybackPeriod
    })
  }, [data])

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Calculator className="w-8 h-8 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">GEO ROI计算器</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 输入参数 */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">输入企业数据</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              月流量量 (访问数)
            </label>
            <input
              type="number"
              value={data.monthlyTraffic}
              onChange={(e) => setData(prev => ({ ...prev, monthlyTraffic: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              当前转化率 (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.conversionRate}
              onChange={(e) => setData(prev => ({ ...prev, conversionRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              平均订单价值 ($)
            </label>
            <input
              type="number"
              value={data.avgOrderValue}
              onChange={(e) => setData(prev => ({ ...prev, avgOrderValue: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预期GEO提升 (%)
            </label>
            <input
              type="number"
              value={data.geoImprovement}
              onChange={(e) => setData(prev => ({ ...prev, geoImprovement: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GEO实施成本 ($)
            </label>
            <input
              type="number"
              value={data.implementationCost}
              onChange={(e) => setData(prev => ({ ...prev, implementationCost: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        
        {/* 计算结果 */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">计算结果</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">当前月收入</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ${results.currentMonthlyRevenue.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-600">预期月收入</span>
                </div>
                <span className="text-lg font-bold text-blue-900">
                  ${results.projectedMonthlyRevenue.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600">月收入增加</span>
                </div>
                <span className="text-lg font-bold text-green-900">
                  ${results.monthlyIncrease.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600">年收入增加</span>
                </div>
                <span className="text-lg font-bold text-green-900">
                  ${results.annualIncrease.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Percent className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-600">投资回报率</span>
                </div>
                <span className="text-lg font-bold text-yellow-900">
                  {results.roi.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-purple-600">回本周期</span>
                </div>
                <span className="text-lg font-bold text-purple-900">
                  {results.paybackPeriod.toFixed(1)} 个月
                </span>
              </div>
            </div>
          </div>
          
          {/* 结果分析 */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">分析总结</h4>
            <div className="text-sm text-gray-700 space-y-1">
              {results.roi > 100 && (
                <p className="text-green-700">✓ ROI超过100%，投资价值很高</p>
              )}
              {results.paybackPeriod < 12 && (
                <p className="text-green-700">✓ 不到1年即可回本，风险较低</p>
              )}
              {results.monthlyIncrease > 1000 && (
                <p className="text-blue-700">✓ 月收入增加显著，价值明显</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ImplementationChecklist = () => {
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({})
  const [activeSection, setActiveSection] = useState('preparation')

  const checklistSections = {
    preparation: {
      title: '前期准备阶段',
      items: [
        '明确GEO优化目标（流量提升、转化率改善等）',
        '设定具体的KPI指标和时间节点',
        '分析目标市场和用户群体',
        '制定预算和资源分配计划',
        '组建GEO实施团队',
        '进行网站技术SEO审计',
        '分析当前关键词排名情况',
        '评估网站用户体验现状',
        '竞争对手分析',
        '识别优化机会和痛点'
      ]
    },
    technical: {
      title: '技术实施阶段',
      items: [
        '优化网站加载速度',
        '确保移动端友好性',
        '实施HTTPS安全协议',
        '优化网站结构和导航',
        '设置XML网站地图',
        '配置robots.txt文件',
        '实施结构化数据标记',
        '进行关键词研究和分析',
        '优化页面标题和描述',
        '改善内容质量和相关性'
      ]
    },
    promotion: {
      title: '推广与外链建设',
      items: [
        '制定外链建设策略',
        '寻找高质量的外链机会',
        '建立社交媒体存在',
        '参与行业论坛和社区',
        '实施本地SEO优化（如适用）'
      ]
    },
    monitoring: {
      title: '监控与优化阶段',
      items: [
        '设置Google Analytics和Search Console',
        '配置关键指标监控',
        '建立定期报告机制',
        '监控竞争对手动态',
        '跟踪用户行为数据',
        '定期分析数据和效果',
        '根据数据调整策略',
        '测试新的优化方法'
      ]
    }
  }

  const handleItemCheck = (sectionKey: string, itemIndex: number) => {
    const key = `${sectionKey}-${itemIndex}`
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getProgress = (sectionKey: string) => {
    const section = checklistSections[sectionKey as keyof typeof checklistSections]
    const checkedCount = section.items.filter((_, index) => 
      checkedItems[`${sectionKey}-${index}`]
    ).length
    return Math.round((checkedCount / section.items.length) * 100)
  }

  const downloadChecklist = () => {
    const element = document.createElement('a')
    element.href = '/data/tools_templates/implementation_checklists.md'
    element.download = 'geo-implementation-checklist.md'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">GEO实施检查清单</h2>
          <p className="text-gray-600">系统化的GEO实施步骤，确保每个环节都得到充分关注</p>
        </div>
        <button
          onClick={downloadChecklist}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          下载完整清单
        </button>
      </div>

      {/* 进度概览 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(checklistSections).map(([key, section]) => {
          const progress = getProgress(key)
          return (
            <div
              key={key}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                activeSection === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveSection(key)}
            >
              <h3 className="font-medium text-gray-900 mb-2">{section.title}</h3>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">{progress}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 检查清单详情 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {checklistSections[activeSection as keyof typeof checklistSections].title}
        </h3>
        <div className="space-y-3">
          {checklistSections[activeSection as keyof typeof checklistSections].items.map((item, index) => {
            const key = `${activeSection}-${index}`
            const isChecked = checkedItems[key] || false
            return (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
              >
                <button
                  onClick={() => handleItemCheck(activeSection, index)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isChecked && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 ${isChecked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {item}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const ContentTemplates = () => {
  const [activeTemplate, setActiveTemplate] = useState('title')
  const [customContent, setCustomContent] = useState({
    brandName: '',
    industry: '',
    product: '',
    location: ''
  })

  const templates = {
    title: {
      name: '页面标题模板',
      icon: '📝',
      templates: [
        '[品牌名] - [核心业务/产品] | [独特价值主张]',
        '[核心关键词] - [品牌名] | [地区/行业领先]',
        '专业[行业]服务 - [品牌名] | [核心优势]',
        '[产品名称] - [核心功能/特点] | [品牌名]',
        '[服务名称] - [服务特点/优势] | [品牌名]'
      ]
    },
    description: {
      name: '页面描述模板',
      icon: '📄',
      templates: [
        '[品牌名]专注于[核心业务]，提供[主要服务/产品]。[核心优势/特色]，已服务[客户数量/案例]，[联系方式/行动号召]。',
        '专业[行业]服务商[品牌名]，[X年]经验，提供[核心服务]。[独特优势]，[成功案例/数据]，立即咨询[联系方式]。',
        '[产品名]是[品牌名]推出的[产品类型]，具有[核心功能]。[产品优势/特点]，[价格信息]，[购买/咨询方式]。'
      ]
    },
    heading: {
      name: '标题结构模板',
      icon: '🏷️',
      templates: [
        'H1: [核心关键词]：[详细说明/价值主张]',
        'H2: 为什么选择[品牌名][服务/产品]？',
        'H2: [服务/产品]的[X大]优势',
        'H3: [具体功能/服务]详解',
        'H3: [优势点]的具体体现'
      ]
    },
    content: {
      name: '内容段落模板',
      icon: '📖',
      templates: [
        '在[行业/领域]中，[痛点/挑战]一直是[目标用户]面临的主要问题。[品牌名]作为专业的[服务/产品]提供商，通过[解决方案/方法]，帮助[客户类型]实现[目标/效果]。',
        '[产品名]是[品牌名]基于[技术/理念]开发的[产品类型]。它具有[核心功能1]、[核心功能2]和[核心功能3]等特点，能够帮助用户[解决问题/实现目标]。',
        '我们的[服务名称]涵盖[服务范围]，包括[具体服务1]、[具体服务2]和[具体服务3]。每项服务都由[专业团队/资质]的专家团队负责，确保[质量标准/效果]。'
      ]
    },
    cta: {
      name: '行动号召模板',
      icon: '🎯',
      templates: [
        '立即咨询专业方案',
        '免费获取[资料/报价]',
        '开始您的[服务/产品]之旅',
        '预约免费[咨询/试用]',
        '获取专属[优惠/方案]'
      ]
    }
  }

  const generateCustomTemplate = (template: string) => {
    let result = template
    result = result.replace(/\[品牌名\]/g, customContent.brandName || '[品牌名]')
    result = result.replace(/\[行业\]/g, customContent.industry || '[行业]')
    result = result.replace(/\[产品名\]/g, customContent.product || '[产品名]')
    result = result.replace(/\[地区\]/g, customContent.location || '[地区]')
    return result
  }

  const downloadTemplates = () => {
    const element = document.createElement('a')
    element.href = '/data/tools_templates/content_optimization_templates.md'
    element.download = 'content-optimization-templates.md'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">内容优化模板</h2>
          <p className="text-gray-600">可直接使用的内容优化模板，提升页面SEO效果</p>
        </div>
        <button
          onClick={downloadTemplates}
          className="inline-flex items-center px-4 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          下载完整模板
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 模板分类 */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 mb-3">模板分类</h3>
          {Object.entries(templates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => setActiveTemplate(key)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeTemplate === key
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <span className="text-lg mr-2">{template.icon}</span>
              {template.name}
            </button>
          ))}
        </div>

        {/* 模板内容 */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-3">
              {templates[activeTemplate as keyof typeof templates].name}
            </h4>
            <div className="space-y-3">
              {templates[activeTemplate as keyof typeof templates].templates.map((template, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <code className="text-sm text-gray-800">{generateCustomTemplate(template)}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(generateCustomTemplate(template))}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    复制
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 自定义参数 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">自定义参数</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="品牌名称"
                value={customContent.brandName}
                onChange={(e) => setCustomContent(prev => ({ ...prev, brandName: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="行业领域"
                value={customContent.industry}
                onChange={(e) => setCustomContent(prev => ({ ...prev, industry: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="产品名称"
                value={customContent.product}
                onChange={(e) => setCustomContent(prev => ({ ...prev, product: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="地区位置"
                value={customContent.location}
                onChange={(e) => setCustomContent(prev => ({ ...prev, location: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PerformanceEvaluator = () => {
  const [activeTab, setActiveTab] = useState('metrics')
  const [metrics, setMetrics] = useState({
    organicTraffic: '',
    keywordRankings: '',
    conversionRate: '',
    pageSpeed: '',
    mobileScore: ''
  })

  const tabs = {
    metrics: { name: '关键指标', icon: '📊' },
    analysis: { name: '数据分析', icon: '🔍' },
    report: { name: '报告生成', icon: '📋' },
    competitor: { name: '竞争分析', icon: '⚔️' }
  }

  const downloadEvaluationTools = () => {
    const element = document.createElement('a')
    element.href = '/data/tools_templates/performance_evaluation_tools.md'
    element.download = 'performance-evaluation-tools.md'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const generateReport = () => {
    const reportData = {
      date: new Date().toLocaleDateString('zh-CN'),
      metrics: metrics,
      analysis: '基于当前数据的分析结果...'
    }
    
    const reportContent = `# GEO效果评估报告\n\n生成日期：${reportData.date}\n\n## 关键指标\n- 有机流量：${metrics.organicTraffic || 'N/A'}\n- 关键词排名：${metrics.keywordRankings || 'N/A'}\n- 转化率：${metrics.conversionRate || 'N/A'}\n- 页面速度：${metrics.pageSpeed || 'N/A'}\n- 移动端评分：${metrics.mobileScore || 'N/A'}\n\n## 分析建议\n${reportData.analysis}`
    
    const element = document.createElement('a')
    const file = new Blob([reportContent], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `geo-performance-report-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">效果评估工具</h2>
          <p className="text-gray-600">评估和跟踪GEO优化效果，生成专业分析报告</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={downloadEvaluationTools}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            下载评估工具
          </button>
          <button
            onClick={generateReport}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            生成报告
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {Object.entries(tabs).map(([key, tab]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
              activeTab === key
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* 标签页内容 */}
      <div className="min-h-[400px]">
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">关键指标监控</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">有机流量 (月访问量)</label>
                <input
                  type="text"
                  value={metrics.organicTraffic}
                  onChange={(e) => setMetrics(prev => ({ ...prev, organicTraffic: e.target.value }))}
                  placeholder="例：10,000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">关键词排名 (平均位置)</label>
                <input
                  type="text"
                  value={metrics.keywordRankings}
                  onChange={(e) => setMetrics(prev => ({ ...prev, keywordRankings: e.target.value }))}
                  placeholder="例：15.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">转化率 (%)</label>
                <input
                  type="text"
                  value={metrics.conversionRate}
                  onChange={(e) => setMetrics(prev => ({ ...prev, conversionRate: e.target.value }))}
                  placeholder="例：3.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">页面速度 (秒)</label>
                <input
                  type="text"
                  value={metrics.pageSpeed}
                  onChange={(e) => setMetrics(prev => ({ ...prev, pageSpeed: e.target.value }))}
                  placeholder="例：2.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">数据分析</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">流量分析</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>有机流量占比</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>月增长率</span>
                    <span className="font-medium text-green-600">+12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>跳出率</span>
                    <span className="font-medium">45%</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-3">关键词表现</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>排名提升词数</span>
                    <span className="font-medium">23个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>新增排名词数</span>
                    <span className="font-medium text-green-600">8个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均排名变化</span>
                    <span className="font-medium text-green-600">+3.2位</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">报告生成</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">月度GEO效果报告预览</h4>
              <div className="bg-white p-4 rounded border text-sm">
                <h5 className="font-medium mb-2">报告摘要</h5>
                <p className="text-gray-600 mb-4">
                  本月GEO优化取得显著进展，有机流量增长{metrics.organicTraffic ? '12%' : 'N/A'}，
                  关键词平均排名提升{metrics.keywordRankings ? '3.2位' : 'N/A'}，
                  整体转化率达到{metrics.conversionRate || 'N/A'}%。
                </p>
                <h5 className="font-medium mb-2">关键指标</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• 有机流量：{metrics.organicTraffic || 'N/A'} 次访问</li>
                  <li>• 关键词排名：平均第 {metrics.keywordRankings || 'N/A'} 位</li>
                  <li>• 转化率：{metrics.conversionRate || 'N/A'}%</li>
                  <li>• 页面速度：{metrics.pageSpeed || 'N/A'} 秒</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitor' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">竞争对手分析</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-3">竞争分析框架</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded">
                  <h5 className="font-medium mb-2">关键词竞争</h5>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 共同关键词分析</li>
                    <li>• 排名差距对比</li>
                    <li>• 机会词识别</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded">
                  <h5 className="font-medium mb-2">内容策略</h5>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 内容类型分析</li>
                    <li>• 更新频率对比</li>
                    <li>• 质量评估</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded">
                  <h5 className="font-medium mb-2">技术表现</h5>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 页面速度对比</li>
                    <li>• 移动端优化</li>
                    <li>• 用户体验评分</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  // 处理URL锚点，自动选择对应工具
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && tools.find(tool => tool.id === hash)) {
      setSelectedTool(hash)
    }
  }, [])

  const renderToolContent = () => {
    if (!selectedTool) return null

    switch (selectedTool) {
      case 'roi-calculator':
        return <ROICalculator />
      case 'implementation-checklist':
        return <ImplementationChecklist />
      case 'content-templates':
        return <ContentTemplates />
      case 'performance-evaluator':
        return <PerformanceEvaluator />
      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">工具正在开发中</h3>
            <p className="text-gray-500">该工具将在后续版本中提供，或可下载相关资料</p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          实用<span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">工具中心</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          提供专业的GEO实施工具和模板，帮助您更高效地实施和评估GEO策略
        </p>
      </div>

      {!selectedTool ? (
        // 工具列表
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={setSelectedTool}
            />
          ))}
        </div>
      ) : (
        // 工具详情
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedTool(null)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回工具列表
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                当前工具: {tools.find(t => t.id === selectedTool)?.title}
              </span>
            </div>
          </div>
          
          {renderToolContent()}
        </div>
      )}

      {/* 底部提示 */}
      {!selectedTool && (
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">更多工具正在开发中</h3>
          <p className="text-gray-600 mb-4">
            我们正在不断完善工具库，包括关键词分析工具、竞争对手分析工具等。
            现在可以先下载相关模板和指南开始实践。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/resource/tools_templates/implementation_checklists.md"
              target="_blank"
              className="inline-flex items-center px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              下载实施检查清单
            </a>
            <a
              href="/resource/tools_templates/content_optimization_templates.md"
              target="_blank"
              className="inline-flex items-center px-6 py-2 border-2 border-green-500 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              获取优化模板
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
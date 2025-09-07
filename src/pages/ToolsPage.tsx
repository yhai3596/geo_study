import React, { useState } from 'react'
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

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const renderToolContent = () => {
    if (!selectedTool) return null

    switch (selectedTool) {
      case 'roi-calculator':
        return <ROICalculator />
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
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  TrendingUp, 
  AlertTriangle, 
  Star, 
  Clock, 
  BookOpen, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Award,
  Target,
  Users,
  DollarSign
} from 'lucide-react'

interface CaseStudy {
  id: string
  title: string
  company: string
  industry: string
  type: 'success' | 'failure' | 'best-practice' | 'project'
  duration: string
  results: string
  description: string
  keyLearnings: string[]
  metrics?: {
    trafficIncrease?: string
    conversionIncrease?: string
    roi?: string
    timeToResults?: string
  }
  difficulty: 'beginner' | 'intermediate' | 'expert'
  tags: string[]
  contentFile?: string
  isMarkdownContent?: boolean
}

const caseStudies: CaseStudy[] = [
  {
    id: 'broworks-success',
    title: 'Broworks: 90天实现AI流量3233%增长',
    company: 'Broworks',
    industry: 'B2B SaaS',
    type: 'success',
    duration: '90天',
    results: 'AI流量从0.3%增加到10%，转化率达27%',
    description: '一家专业提供Webflow SEO服务的B2B SaaS企业，通过系统化的GEO实施策略，在短时90天内实现了数千倍的AI流量增长。',
    keyLearnings: [
      '技术基础建设的重要性：Schema标记和网站结构优化',
      '内容策略转型：从关键词优化向问题解决转变',
      '数据驱动的优化方法：持续监控和调整策略'
    ],
    metrics: {
      trafficIncrease: '3,233%',
      conversionIncrease: '1,186%',
      roi: '4,162%',
      timeToResults: '90天'
    },
    difficulty: 'intermediate',
    tags: ['B2B SaaS', '技术实施', '快速增长', 'Schema标记']
  },
  {
    id: 'ecommerce-optimization',
    title: '电商平台GEO优化最佳实践',
    company: '某电商平台',
    industry: '电子商务',
    type: 'best-practice',
    duration: '6个月',
    results: '产品在AI推荐中的曝光率提升50%',
    description: '通过优化产品描述、用户评价和结构化数据，显著提升了产品在AI搜索中的可见性和推荐频率。',
    keyLearnings: [
      '产品描述要采用自然语言，回答用户常见问题',
      '用户评价是AI判断产品质量的重要指标',
      '结构化数据标记能大幅提高AI的理解能力'
    ],
    difficulty: 'beginner',
    tags: ['电子商务', '产品优化', '结构化数据', '用户评价']
  },
  {
    id: 'content-failure',
    title: '内容营销失败案例：过度优化的教训',
    company: '某内容媒体公司',
    industry: '内容媒体',
    type: 'failure',
    duration: '4个月',
    results: '流量下降15%，用户参与度显著降低',
    description: '该公司过度依赖关键词堆码和模板化内容，导致AI判定内容质量低下，反而损失了流量和用户信任。',
    keyLearnings: [
      '关键词堆码在GEO中是反效的，会被AI识别为低质内容',
      '内容原创性和价值性比SEO技巧更重要',
      '用户体验和内容质量直接影响AI推荐算法'
    ],
    difficulty: 'intermediate',
    tags: ['内容营销', '失败教训', '过度优化', '关键词堆码']
  },
  {
    id: 'local-business',
    title: '本地企业实战项目：可衡量的GEO策略',
    company: '本地餐厅集团',
    industry: '餐饮服务',
    type: 'project',
    duration: '3个月',
    results: '本地AI搜索推荐排名提升65%',
    description: '一个完整的本地企业GEO实施项目，包括地理位置优化、本地评价管理和社区内容营销等策略。',
    keyLearnings: [
      '地理位置和本地化信息对AI本地搜索至关重要',
      '用户评价的数量和质量直接影响AI推荐',
      '社区参与和本地内容对建立本地权威性非常有效'
    ],
    difficulty: 'beginner',
    tags: ['本地企业', '地理位置', '用户评价', '社区营销']
  }
]

// Markdown案例数据
const markdownCases: CaseStudy[] = [
  {
    id: 'success-stories-collection',
    title: 'GEO成功案例分析库',
    company: '多家企业',
    industry: '跨行业',
    type: 'success',
    duration: '综合分析',
    results: '涵盖标杆案例和最佳实践，AI来源访客转化率高达27%',
    description: '基于深度分析报告的成功案例研究，包含不同行业、不同规模企业的详细实施案例。涵盖B2B SaaS、电商、内容媒体等多个行业的标杆案例。',
    keyLearnings: [
      '卓越ROI表现：AI来源访客转化率高达27%，相比传统搜索提升1,186%',
      '快速增长实现：标杆案例在4-6个月内实现数百倍流量增长',
      '系统化方法论：所有成功案例都采用分阶段、标准化实施框架',
      '跨行业适用性：从B2B SaaS到电商都能产生显著效果'
    ],
    difficulty: 'intermediate',
    tags: ['综合案例', '最佳实践', '跨行业', '深度分析', 'ROI优化'],
    contentFile: '/data/case_studies/success_stories.md',
    isMarkdownContent: true
  },
  {
    id: 'failure-analysis-collection',
    title: 'GEO实施失败案例分析',
    company: '34家企业',
    industry: '跨行业',
    type: 'failure',
    duration: '深度研究',
    results: '94%的GEO实施失败源于可预防的错误，提供62项预防措施',
    description: '基于34个具体失败案例的深度分析，系统总结GEO实施过程中的常见错误、失败模式和预防措施。帮助企业避免重复性错误。',
    keyLearnings: [
      '技术基础缺陷：34%的AI爬虫请求导致404错误',
      '策略性误判：78%的企业仍将GEO视为传统SEO延伸',
      '监测体系缺失：85%的企业无法准确追踪AI来源流量',
      '投资回报失效：实施错误企业平均损失67%潜在收益'
    ],
    difficulty: 'intermediate',
    tags: ['失败教训', '预防措施', '风险管控', '错误分析'],
    contentFile: '/data/case_studies/failure_analysis.md',
    isMarkdownContent: true
  },
  {
    id: 'industry-best-practices',
    title: '不同行业GEO最佳实践',
    company: '127家企业',
    industry: '六大核心行业',
    type: 'best-practice',
    duration: '18个月跟踪',
    results: 'B2B SaaS获客成本仅$249，电商AI推荐订单价值提升23%',
    description: '基于127家企业18个月跟踪数据，为六大核心行业提供系统性GEO实施指南。每个行业都有清晰的ROI数据支撑。',
    keyLearnings: [
      'B2B SaaS行业表现最优：获客成本$249，ROI达4.2倍',
      '电商零售转化最快：平均11天决策周期',
      '专业服务线索质量最高：8.9/10评分',
      '早期采用者正在构建难以逾越的竞争壁垒'
    ],
    difficulty: 'expert',
    tags: ['行业实践', '数据驱动', 'ROI分析', '竞争优势'],
    contentFile: '/data/case_studies/industry_best_practices.md',
    isMarkdownContent: true
  },
  {
    id: 'hands-on-projects',
    title: 'GEO实战学习项目',
    company: '实战指南',
    industry: '教育培训',
    type: 'project',
    duration: '分级项目',
    results: '从入门到高级的完整实战项目体系',
    description: 'GEO实战学习项目和练习，包含入门级、中级、高级实战项目，提供详细的操作步骤、评价标准和学习反思。',
    keyLearnings: [
      '入门级：个人博客GEO基础优化实战',
      '中级：企业网站和内容营销战略',
      '高级：多平台整合和企业级GEO战略',
      '实战练习题和模拟场景训练'
    ],
    difficulty: 'beginner',
    tags: ['实战项目', '学习指南', '操作步骤', '技能提升'],
    contentFile: '/data/case_studies/hands_on_projects.md',
    isMarkdownContent: true
  }
]

// 合并所有案例
const allCases = [...caseStudies, ...markdownCases]

const categories = [
  { id: 'all', name: '全部案例', count: allCases.length },
  { id: 'success', name: '成功案例', count: allCases.filter(c => c.type === 'success').length },
  { id: 'failure', name: '失败案例', count: allCases.filter(c => c.type === 'failure').length },
  { id: 'best-practice', name: '最佳实践', count: allCases.filter(c => c.type === 'best-practice').length },
  { id: 'project', name: '实战项目', count: allCases.filter(c => c.type === 'project').length }
]

const industries = [
  { id: 'all', name: '所有行业' },
  { id: 'B2B SaaS', name: 'B2B SaaS' },
  { id: '电子商务', name: '电子商务' },
  { id: '内容媒体', name: '内容媒体' },
  { id: '餐饮服务', name: '餐饮服务' },
  { id: '跨行业', name: '跨行业' },
  { id: '六大核心行业', name: '六大核心行业' },
  { id: '教育培训', name: '教育培训' }
]

const CaseStudyCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100', label: '成功案例' }
      case 'failure':
        return { icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100', label: '失败教训' }
      case 'best-practice':
        return { icon: Star, color: 'text-blue-600', bgColor: 'bg-blue-100', label: '最佳实践' }
      case 'project':
        return { icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-100', label: '实战项目' }
      default:
        return { icon: BookOpen, color: 'text-gray-600', bgColor: 'bg-gray-100', label: '案例分析' }
    }
  }

  const typeConfig = getTypeConfig(caseStudy.type)
  const Icon = typeConfig.icon

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center px-3 py-1 ${typeConfig.bgColor} rounded-full`}>
          <Icon className={`w-4 h-4 ${typeConfig.color} mr-2`} />
          <span className={`text-xs font-medium ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{caseStudy.duration}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {caseStudy.title}
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <span className="font-medium">{caseStudy.company}</span>
          <span className="text-gray-400">•</span>
          <span>{caseStudy.industry}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {caseStudy.description}
        </p>
      </div>
      
      {/* 核心指标 */}
      {caseStudy.metrics && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {caseStudy.metrics.trafficIncrease && (
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-green-600 font-medium">流量增长</div>
              <div className="text-sm font-bold text-green-900">{caseStudy.metrics.trafficIncrease}</div>
            </div>
          )}
          {caseStudy.metrics.conversionIncrease && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-blue-600 font-medium">转化提升</div>
              <div className="text-sm font-bold text-blue-900">{caseStudy.metrics.conversionIncrease}</div>
            </div>
          )}
          {caseStudy.metrics.roi && (
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="text-xs text-yellow-600 font-medium">ROI</div>
              <div className="text-sm font-bold text-yellow-900">{caseStudy.metrics.roi}</div>
            </div>
          )}
          {caseStudy.metrics.timeToResults && (
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xs text-purple-600 font-medium">生效时间</div>
              <div className="text-sm font-bold text-purple-900">{caseStudy.metrics.timeToResults}</div>
            </div>
          )}
        </div>
      )}
      
      {/* 结果概述 */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="text-xs text-gray-600 font-medium mb-1">核心成果</div>
        <div className="text-sm text-gray-900">{caseStudy.results}</div>
      </div>
      
      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {caseStudy.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {tag}
          </span>
        ))}
        {caseStudy.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
            +{caseStudy.tags.length - 3}
          </span>
        )}
      </div>
      
      {/* 难度标识 */}
      <div className="flex items-center justify-between">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          caseStudy.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
          caseStudy.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {caseStudy.difficulty === 'beginner' && '入门'}
          {caseStudy.difficulty === 'intermediate' && '中级'}
          {caseStudy.difficulty === 'expert' && '高级'}
        </div>
        
        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

// Markdown内容渲染组件
const MarkdownCaseDetail = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (caseStudy.contentFile) {
      fetch(caseStudy.contentFile)
        .then(response => {
          if (!response.ok) {
            throw new Error('文件加载失败')
          }
          return response.text()
        })
        .then(text => {
          setContent(text)
          setLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [caseStudy.contentFile])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-600">内容加载失败: {error}</p>
      </div>
    )
  }

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6">{children}</h1>,
          h2: ({children}) => <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{children}</h2>,
          h3: ({children}) => <h3 className="text-xl font-bold text-gray-700 mt-6 mb-3">{children}</h3>,
          p: ({children}) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">{children}</ol>,
          li: ({children}) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
          code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
          pre: ({children}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
          table: ({children}) => <table className="min-w-full border-collapse border border-gray-300 my-4">{children}</table>,
          th: ({children}) => <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">{children}</th>,
          td: ({children}) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default function CaseStudiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [filteredCases, setFilteredCases] = useState<CaseStudy[]>(allCases)
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)

  useEffect(() => {
    let filtered = allCases.filter(caseStudy => {
      const matchesCategory = selectedCategory === 'all' || caseStudy.type === selectedCategory
      const matchesIndustry = selectedIndustry === 'all' || caseStudy.industry === selectedIndustry
      return matchesCategory && matchesIndustry
    })
    setFilteredCases(filtered)
  }, [selectedCategory, selectedIndustry])

  if (selectedCase) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => setSelectedCase(null)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回案例列表
        </button>

        {/* 案例详情 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 如果是markdown案例，使用markdown渲染组件 */}
          {selectedCase.isMarkdownContent ? (
            <MarkdownCaseDetail caseStudy={selectedCase} />
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedCase.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="font-medium">{selectedCase.company}</span>
                  <span>•</span>
                  <span>{selectedCase.industry}</span>
                  <span>•</span>
                  <span>{selectedCase.duration}</span>
                </div>
              </div>

          {/* 核心指标 */}
          {selectedCase.metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(selectedCase.metrics).map(([key, value]) => {
                const getMetricConfig = (key: string) => {
                  switch (key) {
                    case 'trafficIncrease':
                      return { label: '流量增长', icon: TrendingUp, color: 'green' }
                    case 'conversionIncrease':
                      return { label: '转化提升', icon: Target, color: 'blue' }
                    case 'roi':
                      return { label: '投资回报率', icon: DollarSign, color: 'yellow' }
                    case 'timeToResults':
                      return { label: '生效时间', icon: Clock, color: 'purple' }
                    default:
                      return { label: key, icon: Star, color: 'gray' }
                  }
                }
                
                const config = getMetricConfig(key)
                const Icon = config.icon
                
                return (
                  <div key={key} className={`bg-${config.color}-50 rounded-lg p-4 text-center`}>
                    <Icon className={`w-6 h-6 text-${config.color}-600 mx-auto mb-2`} />
                    <div className="text-xs text-gray-600 mb-1">{config.label}</div>
                    <div className={`text-lg font-bold text-${config.color}-900`}>{value}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 案例描述 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">案例背景</h2>
            <p className="text-gray-700 leading-relaxed">{selectedCase.description}</p>
          </div>

          {/* 核心成果 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">核心成果</h2>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
              <p className="text-gray-800 font-medium">{selectedCase.results}</p>
            </div>
          </div>

          {/* 关键学习要点 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">关键学习要点</h2>
            <div className="space-y-3">
              {selectedCase.keyLearnings.map((learning, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{learning}</p>
                </div>
              ))}
            </div>
          </div>

              {/* 标签 */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">相关标签</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          案例<span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">学习中心</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          通过实际案例学习GEO实施策略，了解成功经验和失败教训，提升实践能力
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 筛选侧边栏 */}
        <div className="lg:w-64 space-y-6">
          {/* 案例类型 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">案例类型</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span>{category.name}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 行业筛选 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">行业领域</h3>
            <div className="space-y-2">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      selectedIndustry === industry.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {industry.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 案例列表 */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-600">找到 {filteredCases.length} 个案例</span>
            
            {(selectedCategory !== 'all' || selectedIndustry !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedIndustry('all')
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                清除筛选
              </button>
            )}
          </div>

          {filteredCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCases.map((caseStudy) => (
                <div key={caseStudy.id} onClick={() => setSelectedCase(caseStudy)}>
                  <CaseStudyCard caseStudy={caseStudy} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关案例</h3>
              <p className="text-gray-500">请尝试调整筛选条件</p>
            </div>
          )}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 text-center">
        <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">提交您的案例</h3>
        <p className="text-gray-600 mb-4">
          如果您有GEO实施经验愿意分享，欢迎联系我们。优秀案例将被收录并获得相应认可。
        </p>
        <Link
          to="/resources"
          className="inline-flex items-center px-6 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          了解更多资源
        </Link>
      </div>
    </div>
  )
}
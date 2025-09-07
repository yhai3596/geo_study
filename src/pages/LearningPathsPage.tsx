import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Target, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Star,
  PlayCircle,
  Award,
  Users,
  BarChart3,
  ArrowRight
} from 'lucide-react'
import { useLearning } from '@/contexts/LearningContext'

const learningPaths = [
  {
    id: 'beginner',
    title: '入门级路径：GEO基础认知',
    description: '从零基础到全面理解GEO概念、价值和基本方法',
    duration: '4-8周',
    difficulty: '入门',
    participants: 1250,
    rating: 4.8,
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    modules: [
      {
        id: 'concept-foundation',
        title: 'GEO概念建立',
        description: 'GEO基础概念、发展历程和商业价值',
        duration: '1-2周',
        resources: [
          { title: 'GEO基础教程', path: '/resource/learning_guides/geo_fundamentals.md', type: '文档' },
          { title: '学习路径规划', path: '/resource/learning_guides/learning_paths.md', type: '指南' }
        ]
      },
      {
        id: 'method-learning',
        title: '9种优化方法学习',
        description: '掌握核心优化方法和应用技巧',
        duration: '3-4周',
        resources: [
          { title: '最佳实践手册', path: '/resource/learning_guides/best_practices.md', type: '手册' }
        ]
      },
      {
        id: 'tool-recognition',
        title: '工具认知与使用',
        description: '熟悉常用的GEO工具和平台',
        duration: '5-6周',
        resources: [
          { title: '工具平台汇总', path: '/resource/learning_resources/tools_platforms.md', type: '清单' }
        ]
      }
    ]
  },
  {
    id: 'intermediate',
    title: '实操级路径：技术实施掌握',
    description: '掌握GEO技术实施，独立完成优化项目',
    duration: '8-16周',
    difficulty: '实操',
    participants: 890,
    rating: 4.9,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    modules: [
      {
        id: 'technical-implementation',
        title: '技术实施指南',
        description: '系统学习GEO技术实施方法',
        duration: '3-5周',
        resources: [
          { title: '技术实施指南', path: '/resource/learning_guides/technical_implementation.md', type: '教程' }
        ]
      },
      {
        id: 'practical-cases',
        title: '实战案例分析',
        description: '学习成功企业的实施经验',
        duration: '4-6周',
        resources: [
          { title: '成功案例分析', path: '/resource/case_studies/success_stories.md', type: '案例' },
          { title: '失败案例分析', path: '/resource/case_studies/failure_analysis.md', type: '案例' }
        ]
      },
      {
        id: 'performance-evaluation',
        title: '效果评估与优化',
        description: '掌握效果评估方法和优化策略',
        duration: '6-8周',
        resources: [
          { title: '效果评估工具', path: '/resource/tools_templates/performance_evaluation_tools.md', type: '工具' }
        ]
      }
    ]
  },
  {
    id: 'expert',
    title: '专家级路径：高级策略应用',
    description: '制定高级策略，解决复杂问题，领导团队',
    duration: '6个月以上',
    difficulty: '专家',
    participants: 420,
    rating: 4.7,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    modules: [
      {
        id: 'industry-best-practices',
        title: '行业最佳实践',
        description: '深入研究各行业的最佳实践',
        duration: '8-10周',
        resources: [
          { title: '行业最佳实践', path: '/resource/case_studies/industry_best_practices.md', type: '指南' }
        ]
      },
      {
        id: 'advanced-strategy',
        title: '高级策略制定',
        description: '学习制定高级GEO策略方法',
        duration: '10-12周',
        resources: [
          { title: 'ROI商业分析工具', path: '/resource/tools_templates/roi_business_analysis_tools.md', type: '工具' }
        ]
      }
    ]
  }
]

interface PathProgressCardProps {
  path: any
  isActive: boolean
  onClick: () => void
}

const PathProgressCard: React.FC<PathProgressCardProps> = ({ path, isActive, onClick }) => {
  const { learningProgress } = useLearning()
  
  // 计算进度
  const totalModules = path.modules.length
  const completedModules = path.modules.filter((module: any) => 
    learningProgress[module.id]?.completed
  ).length
  const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  return (
    <div 
      className={`
        cursor-pointer transition-all duration-300 rounded-xl p-6 border-2
        ${isActive 
          ? `bg-gradient-to-br ${path.bgColor} border-transparent shadow-lg` 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{path.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{path.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {path.duration}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {path.participants}
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
              {path.rating}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          path.difficulty === '入门' ? 'bg-green-100 text-green-700' :
          path.difficulty === '实操' ? 'bg-blue-100 text-blue-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {path.difficulty}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>学习进度</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        {completedModules}/{totalModules} 个模块已完成
      </div>
    </div>
  )
}

export default function LearningPathsPage() {
  const [selectedPath, setSelectedPath] = useState(learningPaths[0])
  const { userProfile, learningProgress, updateProgress } = useLearning()

  const handleModuleComplete = (moduleId: string) => {
    const isCompleted = learningProgress[moduleId]?.completed
    updateProgress(moduleId, isCompleted ? 0 : 100, !isCompleted)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          个性化学习<span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">路径系统</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          根据您的基础和目标，选择最适合的学习路径，系统化掌握GEO技能
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 学习路径列表 */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">选择学习路径</h2>
          {learningPaths.map((path) => (
            <PathProgressCard
              key={path.id}
              path={path}
              isActive={selectedPath.id === path.id}
              onClick={() => setSelectedPath(path)}
            />
          ))}
          
          {/* 学习建议 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center mb-3">
              <Award className="w-5 h-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-amber-800">学习建议</h3>
            </div>
            <p className="text-sm text-amber-700">
              建议按照顺序学习，在掌握基础知识后再进入高级阶段。每完成一个模块，记得进行实践练习。
            </p>
          </div>
        </div>

        {/* 详细内容 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPath.title}</h2>
                <p className="text-gray-600">{selectedPath.description}</p>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br ${selectedPath.color} rounded-xl flex items-center justify-center`}>
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* 路径统计 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">学习时间</p>
                <p className="font-semibold text-gray-900">{selectedPath.duration}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">学习模块</p>
                <p className="font-semibold text-gray-900">{selectedPath.modules.length} 个</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">难度等级</p>
                <p className="font-semibold text-gray-900">{selectedPath.difficulty}</p>
              </div>
            </div>

            {/* 学习模块 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">学习模块</h3>
              {selectedPath.modules.map((module, index) => {
                const isCompleted = learningProgress[module.id]?.completed
                const progress = learningProgress[module.id]?.progress || 0
                
                return (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3
                            ${isCompleted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                            }
                          `}>
                            {isCompleted ? <CheckCircle className="w-4 h-4" /> : (index + 1)}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-900">{module.title}</h4>
                        </div>
                        <p className="text-gray-600 ml-11 mb-3">{module.description}</p>
                        <div className="ml-11 text-sm text-gray-500">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {module.duration}
                        </div>
                      </div>
                      <button
                        onClick={() => handleModuleComplete(module.id)}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-colors
                          ${isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }
                        `}
                      >
                        {isCompleted ? '已完成' : '开始学习'}
                      </button>
                    </div>
                    
                    {/* 进度条 */}
                    {!isCompleted && progress > 0 && (
                      <div className="ml-11 mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>学习进度</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 学习资源 */}
                    <div className="ml-11">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">相关资源：</h5>
                      <div className="space-y-2">
                        {module.resources.map((resource, idx) => (
                          <Link
                            key={idx}
                            to={resource.path}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            <span>{resource.title}</span>
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {resource.type}
                            </span>
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 行动按钮 */}
            <div className="flex justify-center mt-8">
              <Link
                to="/resources"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                浏览所有资源
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
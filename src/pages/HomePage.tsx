import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowRight,
  Play,
  Download,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useLearning } from '@/contexts/LearningContext'

// 首页统计卡片组件
const StatsCard = ({ icon: Icon, title, value, description, color }: any) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  </div>
)

// 快速开始卡片组件
const QuickStartCard = ({ icon: Icon, title, description, link, time, level }: any) => (
  <Link to={link} className="group">
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
      <div className={`w-12 h-12 bg-gradient-to-br ${level === 'beginner' ? 'from-green-400 to-green-600' : level === 'intermediate' ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {time}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {level === 'beginner' && '入门'}
            {level === 'intermediate' && '实操'}
            {level === 'expert' && '专家'}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
  </Link>
)

export default function HomePage() {
  const { userProfile } = useLearning()
  const [resourceStats, setResourceStats] = useState({
    guides: 0,
    resources: 0,
    tools: 0,
    cases: 0
  })

  // 加载资源统计
  useEffect(() => {
    const loadResourceStats = async () => {
      try {
        // 简单的文件计数统计
        setResourceStats({
          guides: 4, // learning_guides
          resources: 6, // learning_resources + geo_toolkit
          tools: 4, // tools_templates
          cases: 4 // case_studies
        })
      } catch (error) {
        console.error('加载资源统计失败:', error)
      }
    }
    loadResourceStats()
  }, [])

  const quickStartItems = [
    {
      icon: BookOpen,
      title: "GEO基础概念",
      description: "了解生成式引擎优化的基本原理和核心概念",
      link: "/resource/learning_guides/geo_fundamentals.md",
      time: "30分钟",
      level: "beginner"
    },
    {
      icon: Target,
      title: "学习路径规划",
      description: "制定适合您的GEO学习计划和发展路线",
      link: "/resource/learning_guides/learning_paths.md",
      time: "45分钟",
      level: "beginner"
    },
    {
      icon: TrendingUp,
      title: "成功案例分析",
      description: "学习行业标杆企业的GEO实施策略和效果",
      link: "/resource/case_studies/success_stories.md",
      time: "60分钟",
      level: "intermediate"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 英雄区块 */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-full text-sm font-medium text-blue-700 mb-4">
            <Award className="w-4 h-4 mr-2" />
            专业的GEO学习平台
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          掌握<span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">生成式引擎优化</span>
          <br />开启AI时代营销新篇章
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          基于权威学术研究和行业最佳实践，提供系统化的GEO学习资源库，帮助您在AI搜索时代构建竞争优势
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/learning-paths"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Play className="w-5 h-5 mr-2" />
            开始学习之旅
          </Link>
          <Link 
            to="/resources"
            className="inline-flex items-center px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
          >
            <Download className="w-5 h-5 mr-2" />
            浏览学习资源
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          icon={BookOpen}
          title="学习指南"
          value={resourceStats.guides}
          description="全面的GEO理论和实践指导"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatsCard
          icon={Users}
          title="学习资源"
          value={resourceStats.resources}
          description="权威资源和社区平台汇总"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatsCard
          icon={Award}
          title="实用工具"
          value={resourceStats.tools}
          description="实施检查清单和评估工具"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatsCard
          icon={TrendingUp}
          title="案例研究"
          value={resourceStats.cases}
          description="成功案例和行业最佳实践"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* 快速开始 */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">快速开始</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            根据您的学习目标，选择最适合的入门路径，开始您的GEO学习之旅
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStartItems.map((item, index) => (
            <QuickStartCard key={index} {...item} />
          ))}
        </div>
      </div>

      {/* 学习进度概览 */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">您的学习进度</h3>
            <p className="text-gray-600 mb-4">
              当前等级: <span className="font-medium text-blue-600">
                {userProfile.level === 'beginner' && '入门级学习者'}
                {userProfile.level === 'intermediate' && '实操级学习者'}
                {userProfile.level === 'expert' && '专家级学习者'}
                {userProfile.level === 'specialized' && '专业化学习者'}
              </span>
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                已完成 {Object.values({}).filter((p: any) => p?.completed).length} 个模块
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                收藏 {userProfile.bookmarks.length} 个资源
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray={`${userProfile.totalProgress}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{userProfile.totalProgress}%</span>
              </div>
            </div>
            <Link 
              to="/profile"
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              查看详细进度
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* 特色功能 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">个性化学习路径</h3>
          <p className="text-gray-600 mb-4">
            基于您的基础和目标，智能推荐最适合的学习顺序和内容，确保学习效果最大化。
          </p>
          <Link to="/learning-paths" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
            开始规划 <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">实战工具中心</h3>
          <p className="text-gray-600 mb-4">
            提供ROI计算器、实施检查清单、效果评估工具等实用工具，让学习立即应用到实践中。
          </p>
          <Link to="/tools" className="text-green-600 font-medium hover:text-green-700 inline-flex items-center">
            使用工具 <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
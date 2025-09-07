import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Wrench, 
  FolderOpen,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  Download,
  ExternalLink,
  ChevronDown,
  Grid,
  List,
  SortDesc
} from 'lucide-react'
import { useLearning } from '@/contexts/LearningContext'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: string
  path: string
  difficulty: 'beginner' | 'intermediate' | 'expert'
  duration: string
  rating: number
  tags: string[]
}

const resourcesData: Resource[] = [
  {
    id: 'geo_fundamentals',
    title: 'GEO基础教程',
    description: '全面介绍生成式引擎优化的基本概念、原理和应用方法',
    category: 'learning_guides',
    type: '教程',
    path: '/resource/learning_guides/geo_fundamentals.md',
    difficulty: 'beginner',
    duration: '2-3小时',
    rating: 4.9,
    tags: ['入门', '基础概念', 'AI搜索']
  },
  {
    id: 'learning_paths',
    title: '学习路径体系',
    description: '系统化的GEO学习路径和能力等级定义',
    category: 'learning_guides',
    type: '指南',
    path: '/resource/learning_guides/learning_paths.md',
    difficulty: 'beginner',
    duration: '1小时',
    rating: 4.8,
    tags: ['学习计划', '职业发展', '技能评估']
  },
  {
    id: 'technical_implementation',
    title: '技术实施指南',
    description: '详细的GEO技术实施步骤和最佳实践',
    category: 'learning_guides',
    type: '教程',
    path: '/resource/learning_guides/technical_implementation.md',
    difficulty: 'intermediate',
    duration: '3-4小时',
    rating: 4.7,
    tags: ['技术实施', '实操教程', 'Schema标记']
  },
  {
    id: 'best_practices',
    title: '最佳实践手册',
    description: '基于实战经验总结的GEO最佳实践和优化技巧',
    category: 'learning_guides',
    type: '手册',
    path: '/resource/learning_guides/best_practices.md',
    difficulty: 'intermediate',
    duration: '2-3小时',
    rating: 4.9,
    tags: ['最佳实践', '优化技巧', '实战经验']
  },
  {
    id: 'success_stories',
    title: '成功案例分析',
    description: '详细分析各行业企业的GEO成功实施案例',
    category: 'case_studies',
    type: '案例',
    path: '/resource/case_studies/success_stories.md',
    difficulty: 'intermediate',
    duration: '1-2小时',
    rating: 4.8,
    tags: ['成功案例', 'ROI分析', '实施策略']
  },
  {
    id: 'roi_tools',
    title: 'ROI计算工具',
    description: 'GEO投资回报率计算和商业价值分析工具',
    category: 'tools_templates',
    type: '工具',
    path: '/resource/tools_templates/roi_business_analysis_tools.md',
    difficulty: 'expert',
    duration: '30分钟',
    rating: 4.6,
    tags: ['ROI计算', '商业分析', '数据分析']
  }
]

const categories = [
  { id: 'all', name: '全部资源', icon: FolderOpen, count: resourcesData.length },
  { id: 'learning_guides', name: '学习指南', icon: BookOpen, count: 4 },
  { id: 'learning_resources', name: '学习资源', icon: FileText, count: 6 },
  { id: 'case_studies', name: '案例学习', icon: Star, count: 4 },
  { id: 'tools_templates', name: '实用工具', icon: Wrench, count: 4 }
]

const difficulties = [
  { id: 'all', name: '所有难度' },
  { id: 'beginner', name: '入门级' },
  { id: 'intermediate', name: '实操级' },
  { id: 'expert', name: '专家级' }
]

const sortOptions = [
  { id: 'rating', name: '评分排序' },
  { id: 'duration', name: '学习时间' },
  { id: 'title', name: '标题排序' }
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resourcesData)
  
  const { userProfile, addBookmark, removeBookmark } = useLearning()

  // 筛选和搜索逻辑
  useEffect(() => {
    let filtered = resourcesData.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'title':
          return a.title.localeCompare(b.title)
        case 'duration':
          return a.duration.localeCompare(b.duration)
        default:
          return 0
      }
    })

    setFilteredResources(filtered)
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const isBookmarked = (resourceId: string) => userProfile.bookmarks.includes(resourceId)

  const toggleBookmark = (resourceId: string) => {
    if (isBookmarked(resourceId)) {
      removeBookmark(resourceId)
    } else {
      addBookmark(resourceId)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          学习<span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">资源库</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          精心筛选的GEO学习资源，包括教程、指南、工具和案例分析
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 侧边栏筛选 */}
        <div className="lg:w-64 space-y-6">
          {/* 搜索框 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">搜索资源</h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索标题、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">资源分类</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
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
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 难度筛选 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">难度等级</h3>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      selectedDifficulty === difficulty.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1">
          {/* 工具栏 */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  找到 {filteredResources.length} 个资源
                </span>
                {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                      setSelectedDifficulty('all')
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    清除筛选
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* 排序 */}
                <div className="flex items-center space-x-2">
                  <SortDesc className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 视图切换 */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`
                      p-2 rounded-l-lg transition-colors
                      ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}
                    `}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`
                      p-2 rounded-r-lg transition-colors
                      ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}
                    `}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 资源列表 */}
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className={`
                  bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group
                  ${viewMode === 'grid' ? 'p-6' : 'p-6 flex items-center space-x-6'}
                `}
              >
                {viewMode === 'grid' ? (
                  // 网格布局
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          resource.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }
                      `}>
                        {resource.difficulty === 'beginner' && '入门'}
                        {resource.difficulty === 'intermediate' && '实操'}
                        {resource.difficulty === 'expert' && '专家'}
                      </div>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {isBookmarked(resource.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{resource.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link
                      to={resource.path}
                      className="inline-flex items-center w-full justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                    >
                      开始学习
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </>
                ) : (
                  // 列表布局
                  <>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </h3>
                        <button
                          onClick={() => toggleBookmark(resource.id)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors ml-4"
                        >
                          {isBookmarked(resource.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            resource.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }
                        `}>
                          {resource.difficulty === 'beginner' && '入门'}
                          {resource.difficulty === 'intermediate' && '实操'}
                          {resource.difficulty === 'expert' && '专家'}
                        </span>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {resource.duration}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                          {resource.rating}
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to={resource.path}
                      className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 whitespace-nowrap"
                    >
                      开始学习
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关资源</h3>
              <p className="text-gray-500">请尝试调整搜索条件或筛选条件</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
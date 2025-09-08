import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  BookOpen, 
  Target, 
  FolderOpen, 
  Wrench, 
  FileText, 
  User, 
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useLearning } from '@/contexts/LearningContext'

interface CollapsibleSidebarProps {
  className?: string
  onCollapseChange?: (collapsed: boolean) => void
}

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '学习路径', href: '/learning-paths', icon: Target },
  { name: '学习资源', href: '/resources', icon: FolderOpen },
  { name: '实用工具', href: '/tools', icon: Wrench },
  { name: '案例学习', href: '/case-studies', icon: FileText },
  { name: '个人中心', href: '/profile', icon: User },
]

export default function CollapsibleSidebar({ className = '', onCollapseChange }: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { userProfile } = useLearning()
  const location = useLocation()

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
      ${isScrolled ? 'shadow-2xl' : 'shadow-xl'}
      ${className}
    `}>
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              GEO学习库
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/" className="flex items-center justify-center w-full">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </Link>
        )}
      </div>

      {/* 收缩按钮 */}
      <div className="absolute -right-3 top-20 z-50">
        <button
          onClick={() => {
            const newCollapsed = !isCollapsed
            setIsCollapsed(newCollapsed)
            onCollapseChange?.(newCollapsed)
          }}
          className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* 用户信息卡片 */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {userProfile.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userProfile.level === 'beginner' && '入门级'}
                  {userProfile.level === 'intermediate' && '实操级'}
                  {userProfile.level === 'expert' && '专家级'}
                  {userProfile.level === 'specialized' && '专业化'}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>学习进度</span>
                <span>{userProfile.totalProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${userProfile.totalProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 导航菜单 */}
      <nav className="px-2 py-4 space-y-1 overflow-y-auto flex-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
                ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={`
                h-5 w-5 transition-colors duration-200
                ${isCollapsed ? '' : 'mr-3'}
                ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
              `} />
              {!isCollapsed && item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
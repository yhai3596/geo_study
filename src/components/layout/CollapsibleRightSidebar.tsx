import React, { useState, useEffect } from 'react'
import { 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Download,
  BookOpen,
  PenTool
} from 'lucide-react'

interface CollapsibleRightSidebarProps {
  readingProgress: number
  noteText: string
  onNoteChange: (text: string) => void
  onDownload: () => void
  className?: string
  onCollapseChange?: (collapsed: boolean) => void
}

export default function CollapsibleRightSidebar({
  readingProgress,
  noteText,
  onNoteChange,
  onDownload,
  className = '',
  onCollapseChange
}: CollapsibleRightSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('progress')

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sections = [
    { id: 'progress', name: '学习进度', icon: CheckCircle },
    { id: 'notes', name: '学习笔记', icon: PenTool },
    { id: 'actions', name: '快速操作', icon: BookOpen }
  ]

  return (
    <div className={`
      fixed right-0 top-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-80'}
      ${isScrolled ? 'shadow-2xl' : 'shadow-xl'}
      ${className}
    `}>
      {/* 收缩按钮 */}
      <div className="absolute -left-3 top-20 z-50">
        <button
          onClick={() => {
            const newCollapsed = !isCollapsed
            setIsCollapsed(newCollapsed)
            onCollapseChange?.(newCollapsed)
          }}
          className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* 头部标签 */}
      <div className="border-b border-gray-200">
        {!isCollapsed ? (
          <div className="flex">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200
                    ${activeSection === section.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs">{section.name}</div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col py-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    p-3 transition-colors duration-200
                    ${activeSection === section.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  title={section.name}
                >
                  <Icon className="w-5 h-5 mx-auto" />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 学习进度 */}
        {activeSection === 'progress' && (
          <div className="space-y-4">
            {!isCollapsed && (
              <h3 className="text-lg font-semibold text-gray-900">学习进度</h3>
            )}
            <div className="text-center">
              <div className={`relative mx-auto ${
                isCollapsed ? 'w-12 h-12' : 'w-20 h-20'
              }`}>
                <svg className={`transform -rotate-90 ${
                  isCollapsed ? 'w-12 h-12' : 'w-20 h-20'
                }`} viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${readingProgress}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-bold text-gray-900 ${
                    isCollapsed ? 'text-xs' : 'text-lg'
                  }`}>{readingProgress}%</span>
                </div>
              </div>
            </div>
            
            {!isCollapsed && (
              <div className="mt-4">
                {readingProgress >= 95 ? (
                  <div className="flex items-center justify-center text-green-600 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    已完成学习
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    继续阅读完成学习
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 学习笔记 */}
        {activeSection === 'notes' && (
          <div className="space-y-4">
            {!isCollapsed && (
              <h3 className="text-lg font-semibold text-gray-900">学习笔记</h3>
            )}
            {!isCollapsed ? (
              <div>
                <textarea
                  value={noteText}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="记录你的学习心得和重点..."
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  笔记会自动保存到本地存储
                </p>
              </div>
            ) : (
              <div className="text-center">
                <PenTool className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <div className="text-xs text-gray-500">
                  {noteText ? '有笔记' : '无笔记'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 快速操作 */}
        {activeSection === 'actions' && (
          <div className="space-y-4">
            {!isCollapsed && (
              <h3 className="text-lg font-semibold text-gray-900">快速操作</h3>
            )}
            <div className="space-y-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`
                  w-full flex items-center text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors
                  ${isCollapsed ? 'justify-center p-3' : 'text-left px-3 py-2'}
                `}
                title={isCollapsed ? '回到顶部' : undefined}
              >
                <ArrowUp className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && '回到顶部'}
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
                className={`
                  w-full flex items-center text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors
                  ${isCollapsed ? 'justify-center p-3' : 'text-left px-3 py-2'}
                `}
                title={isCollapsed ? '到页面底部' : undefined}
              >
                <ArrowDown className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && '到页面底部'}
              </button>
              <button
                onClick={onDownload}
                className={`
                  w-full flex items-center text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors
                  ${isCollapsed ? 'justify-center p-3' : 'text-left px-3 py-2'}
                `}
                title={isCollapsed ? '下载文档' : undefined}
              >
                <Download className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && '下载文档'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
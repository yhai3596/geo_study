import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  Share2, 
  Clock, 
  Star, 
  CheckCircle,
  FileText,
  Eye
} from 'lucide-react'
import { useLearning } from '@/contexts/LearningContext'
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar'
import CollapsibleRightSidebar from '@/components/layout/CollapsibleRightSidebar'
import 'highlight.js/styles/github.css'

export default function ResourceDetailPage() {
  const { category, file } = useParams<{ category: string; file: string }>()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  
  const { userProfile, addBookmark, removeBookmark, updateProgress, addNote } = useLearning()
  
  const resourceId = `${category}_${file?.replace('.md', '')}`
  const isBookmarked = userProfile.bookmarks.includes(resourceId)
  const currentNote = userProfile.notes[resourceId] || ''
  const [noteText, setNoteText] = useState(currentNote)

  // 加载文档内容
  useEffect(() => {
    const loadContent = async () => {
      if (!category || !file) return
      
      try {
        setLoading(true)
        const response = await fetch(`/data/${category}/${file}`)
        if (!response.ok) {
          throw new Error('文档加载失败')
        }
        const text = await response.text()
        setContent(text)
      } catch (err) {
        setError('加载文档失败，请稍后再试')
        console.error('Load content error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadContent()
  }, [category, file])

  // 进度跟踪
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(100, Math.round((scrolled / maxHeight) * 100))
      setReadingProgress(progress)
      
      // 自动更新学习进度
      if (progress > 0) {
        updateProgress(resourceId, progress, progress >= 95)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [resourceId, updateProgress])

  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(resourceId)
    } else {
      addBookmark(resourceId)
    }
  }

  const handleNoteChange = (text: string) => {
    setNoteText(text)
    addNote(resourceId, text)
  }

  const downloadContent = () => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `${resourceId}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const shareResource = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GEO学习资源: ${file?.replace('.md', '')}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('分享取消')
      }
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
          <div className="space-y-4 mt-8">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">加载错误</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link 
            to="/resources"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回资源库
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 左侧导航栏 - 桌面端显示 */}
      <div className="hidden lg:block">
        <CollapsibleSidebar 
          onCollapseChange={setLeftSidebarCollapsed}
        />
      </div>

      {/* 右侧功能栏 - 桌面端显示 */}
      <div className="hidden lg:block">
        <CollapsibleRightSidebar
          readingProgress={readingProgress}
          noteText={noteText}
          onNoteChange={handleNoteChange}
          onDownload={downloadContent}
          onCollapseChange={setRightSidebarCollapsed}
        />
      </div>

      {/* 主内容区域 */}
      <div className={`transition-all duration-300 pb-20 lg:pb-0 lg:${
        leftSidebarCollapsed ? 'ml-16' : 'ml-64'
      } lg:${
        rightSidebarCollapsed ? 'mr-16' : 'mr-80'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link 
                to="/resources" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回资源列表
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleBookmark}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 mr-2" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-2" />
                )}
                {isBookmarked ? '已收藏' : '收藏'}
              </button>
              
              <button
                onClick={shareResource}
                className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </button>
            </div>
          </div>

          {/* 文档内容 */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="prose prose-lg prose-blue max-w-none markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-700 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 ml-6 list-disc space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 ml-6 list-decimal space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-700 leading-relaxed">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 italic text-gray-700">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className, ...props }) => {
                      // 检查是否在pre标签内（代码块）
                      const isCodeBlock = className && className.includes('language-');
                      const inline = !isCodeBlock;
                      
                      if (inline) {
                        return (
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                            {children}
                          </code>
                        );
                      }
                      
                      if (isCodeBlock) {
                        // 代码块内的code标签，不设置背景色，继承pre的样式
                        return (
                          <code className={`${className} text-inherit`}>
                            {children}
                          </code>
                        );
                      }
                      
                      // 独立的代码块
                      return (
                        <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-800">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border">
                        {children}
                      </pre>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-700">
                        {children}
                      </em>
                    ),
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-300">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-50">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-gray-200">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-gray-50">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-300">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                        {children}
                      </td>
                    ),
                    img: ({ src, alt }) => {
                      // 处理相对路径，将 ../charts/ 转换为 /data/charts/，../workspace/charts/ 转换为 /workspace/charts/
                      let imageSrc = src;
                      if (src?.startsWith('../charts/')) {
                        imageSrc = src.replace('../charts/', '/data/charts/');
                      } else if (src?.startsWith('../workspace/charts/')) {
                        imageSrc = src.replace('../workspace/charts/', '/workspace/charts/');
                      }
                      
                      return (
                        <img 
                          src={imageSrc} 
                          alt={alt} 
                          className="max-w-full h-auto rounded-lg shadow-md my-6 mx-auto block"
                          onError={(e) => {
                            console.error('Image load error:', imageSrc);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      );
                    },
                    hr: () => (
                      <hr className="my-8 border-gray-300" />
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* 移动端底部功能栏 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex items-center justify-between">
          {/* 学习进度 */}
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={`${readingProgress}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">{Math.round(readingProgress)}%</span>
              </div>
            </div>
            <span className="text-sm text-gray-600">学习进度</span>
          </div>

          {/* 快速操作按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <button
              onClick={downloadContent}
              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
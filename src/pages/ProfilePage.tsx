import React, { useState } from 'react'
import { 
  User, 
  Trophy, 
  BookOpen, 
  Clock, 
  Target, 
  Calendar, 
  Award, 
  Download, 
  Edit3, 
  Save, 
  X,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Bookmark,
  FileText
} from 'lucide-react'
import { useLearning } from '@/contexts/LearningContext'

const achievements = [
  { id: 'first-step', title: '初学者', description: '完成首个学习模块', icon: Target, condition: 'complete-1-module' },
  { id: 'knowledge-seeker', title: '知识探索者', description: '完成入门级学习路径', icon: BookOpen, condition: 'complete-beginner-path' },
  { id: 'practitioner', title: '实践者', description: '完成5个学习模块', icon: CheckCircle, condition: 'complete-5-modules' },
  { id: 'bookworm', title: '收藏家', description: '收蔅10个学习资源', icon: Bookmark, condition: 'bookmark-10-resources' },
  { id: 'note-taker', title: '笔记达人', description: '为5个资源添加学习笔记', icon: FileText, condition: 'note-5-resources' }
]

const levelThresholds = [
  { level: 'beginner', name: '入门级', min: 0, max: 25, color: 'green' },
  { level: 'intermediate', name: '实操级', min: 26, max: 65, color: 'blue' },
  { level: 'expert', name: '专家级', min: 66, max: 90, color: 'purple' },
  { level: 'specialized', name: '专业化', min: 91, max: 100, color: 'gold' }
]

const AchievementCard = ({ achievement, isUnlocked }: { achievement: any; isUnlocked: boolean }) => {
  const Icon = achievement.icon
  
  return (
    <div className={`
      p-4 rounded-lg border-2 transition-all duration-300
      ${isUnlocked 
        ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md' 
        : 'border-gray-200 bg-gray-50'
      }
    `}>
      <div className="flex items-center mb-3">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center mr-3
          ${isUnlocked ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-gray-500'}
        `}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className={`font-semibold ${
            isUnlocked ? 'text-yellow-800' : 'text-gray-500'
          }`}>
            {achievement.title}
          </h4>
          <p className={`text-sm ${
            isUnlocked ? 'text-yellow-700' : 'text-gray-400'
          }`}>
            {achievement.description}
          </p>
        </div>
      </div>
      
      {isUnlocked && (
        <div className="flex items-center text-sm text-yellow-700">
          <Trophy className="w-4 h-4 mr-1" />
          已解锁
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { userProfile, learningProgress, updateProfile } = useLearning()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    email: userProfile.email
  })

  // 计算统计数据
  const totalModules = Object.keys(learningProgress).length
  const completedModules = Object.values(learningProgress).filter(p => p.completed).length
  const inProgressModules = Object.values(learningProgress).filter(p => p.progress > 0 && !p.completed).length
  const totalBookmarks = userProfile.bookmarks.length
  const totalNotes = Object.keys(userProfile.notes).filter(key => userProfile.notes[key]?.trim()).length

  // 计算当前等级
  const currentLevelInfo = levelThresholds.find(level => 
    userProfile.totalProgress >= level.min && userProfile.totalProgress <= level.max
  ) || levelThresholds[0]

  // 检查成就解锁情况
  const checkAchievement = (condition: string) => {
    switch (condition) {
      case 'complete-1-module':
        return completedModules >= 1
      case 'complete-beginner-path':
        return userProfile.totalProgress >= 25
      case 'complete-5-modules':
        return completedModules >= 5
      case 'bookmark-10-resources':
        return totalBookmarks >= 10
      case 'note-5-resources':
        return totalNotes >= 5
      default:
        return false
    }
  }

  const handleSaveProfile = () => {
    updateProfile(editForm)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditForm({
      name: userProfile.name,
      email: userProfile.email
    })
    setIsEditing(false)
  }

  const exportLearningData = () => {
    const data = {
      profile: userProfile,
      progress: learningProgress,
      exportDate: new Date().toISOString(),
      summary: {
        totalProgress: userProfile.totalProgress,
        completedModules,
        totalBookmarks,
        totalNotes
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `geo-learning-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          个人<span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">学习中心</span>
        </h1>
        <p className="text-xl text-gray-600">
          跟踪您的学习进度，管理个人资料和成就
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：用户信息和统计 */}
        <div className="space-y-6">
          {/* 用户信息卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">个人信息</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  title="编辑信息"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="p-2 text-green-500 hover:text-green-600 transition-colors"
                    title="保存"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    title="取消"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {userProfile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-center text-xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入姓名"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full text-center text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入邮箱"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{userProfile.name}</h3>
                  <p className="text-gray-600 mb-3">{userProfile.email || '未设置邮箱'}</p>
                </div>
              )}
            </div>
            
            {/* 等级信息 */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 bg-${currentLevelInfo.color === 'gold' ? 'yellow' : currentLevelInfo.color}-100 text-${currentLevelInfo.color === 'gold' ? 'yellow' : currentLevelInfo.color}-700 rounded-full mb-4`}>
                <Award className="w-5 h-5 mr-2" />
                <span className="font-medium">{currentLevelInfo.name}</span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>学习进度</span>
                  <span>{userProfile.totalProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`bg-gradient-to-r from-${currentLevelInfo.color === 'gold' ? 'yellow' : currentLevelInfo.color}-400 to-${currentLevelInfo.color === 'gold' ? 'yellow' : currentLevelInfo.color}-600 h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${userProfile.totalProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 学习统计 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">学习统计</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">已完成模块</span>
                </div>
                <span className="text-xl font-bold text-green-600">{completedModules}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">学习中</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{inProgressModules}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Bookmark className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-gray-700">收藏资源</span>
                </div>
                <span className="text-xl font-bold text-yellow-600">{totalBookmarks}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-gray-700">学习笔记</span>
                </div>
                <span className="text-xl font-bold text-purple-600">{totalNotes}</span>
              </div>
            </div>
          </div>

          {/* 数据导出 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">数据管理</h3>
            <p className="text-gray-600 text-sm mb-4">
              您可以导出学习数据进行备份或分析
            </p>
            <button
              onClick={exportLearningData}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              导出学习数据
            </button>
          </div>
        </div>

        {/* 右侧：学习进度和成就 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 学习进度图表 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">学习进度分析</h3>
            
            {totalModules > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 进度统计 */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
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
                        stroke="url(#progressGradient)"
                        strokeWidth="2"
                        strokeDasharray={`${userProfile.totalProgress}, 100`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{userProfile.totalProgress}%</span>
                    </div>
                  </div>
                  <p className="text-gray-600">总体进度</p>
                </div>
                
                {/* 模块完成率 */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0}%
                  </div>
                  <p className="text-gray-600">模块完成率</p>
                  <p className="text-sm text-gray-500 mt-1">{completedModules}/{totalModules} 模块</p>
                </div>
                
                {/* 活跃度 */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.round((Object.values(learningProgress).filter(p => p.progress > 0).length / Math.max(totalModules, 1)) * 100)}%
                  </div>
                  <p className="text-gray-600">学习活跃度</p>
                  <p className="text-sm text-gray-500 mt-1">参与学习的模块比例</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">开始学习后将显示进度分析</p>
              </div>
            )}
          </div>

          {/* 成就系统 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">成就奖章</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const isUnlocked = checkAchievement(achievement.condition)
                return (
                  <AchievementCard 
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={isUnlocked}
                  />
                )
              })}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">成就进度</h4>
                  <p className="text-sm text-gray-600">
                    已解锁 {achievements.filter(a => checkAchievement(a.condition)).length} / {achievements.length} 个成就
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((achievements.filter(a => checkAchievement(a.condition)).length / achievements.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 最近活动 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">最近活动</h3>
            
            {Object.entries(learningProgress)
              .filter(([_, progress]) => progress.completedAt)
              .sort(([, a], [, b]) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
              .slice(0, 5)
              .map(([moduleId, progress]) => (
                <div key={moduleId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">完成模块: {moduleId}</p>
                      <p className="text-sm text-gray-500">
                        {progress.completedAt ? new Date(progress.completedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              ))
            }
            
            {Object.keys(learningProgress).length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无学习活动记录</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
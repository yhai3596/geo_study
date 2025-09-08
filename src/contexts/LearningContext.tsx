import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

interface LearningProgress {
  [key: string]: {
    completed: boolean
    completedAt?: Date
    progress: number
  }
}

interface UserProfile {
  name: string
  email: string
  level: 'beginner' | 'intermediate' | 'expert' | 'specialized'
  totalProgress: number
  achievements: string[]
  bookmarks: string[]
  notes: { [key: string]: string }
}

interface LearningContextType {
  userProfile: UserProfile
  learningProgress: LearningProgress
  updateProgress: (itemId: string, progress: number, completed?: boolean) => void
  addBookmark: (resourceId: string) => void
  removeBookmark: (resourceId: string) => void
  addNote: (resourceId: string, note: string) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  syncData: () => Promise<void>
  isLoading: boolean
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

interface LearningProviderProps {
  children: ReactNode
}

const defaultProfile: UserProfile = {
  name: '学习者',
  email: '',
  level: 'beginner',
  totalProgress: 0,
  achievements: [],
  bookmarks: [],
  notes: {}
}

export function LearningProvider({ children }: LearningProviderProps) {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile)
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({})
  const [isLoading, setIsLoading] = useState(false)

  // 从Supabase或localStorage加载数据
  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      loadLocalData()
    }
  }, [user])

  // 保存数据到Supabase或localStorage
  useEffect(() => {
    if (user) {
      saveUserProfile()
    } else {
      localStorage.setItem('geo-learning-profile', JSON.stringify(userProfile))
    }
  }, [userProfile, user])

  useEffect(() => {
    if (user) {
      saveLearningProgress()
    } else {
      localStorage.setItem('geo-learning-progress', JSON.stringify(learningProgress))
    }
    
    // 计算总进度
    const totalItems = Object.keys(learningProgress).length
    const completedItems = Object.values(learningProgress).filter(item => item.completed).length
    const totalProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    
    setUserProfile(prev => ({ ...prev, totalProgress }))
  }, [learningProgress, user])

  const loadLocalData = () => {
    const savedProfile = localStorage.getItem('geo-learning-profile')
    const savedProgress = localStorage.getItem('geo-learning-progress')
    
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile))
      } catch (e) {
        console.warn('无法解析保存的用户资料')
      }
    }
    
    if (savedProgress) {
      try {
        setLearningProgress(JSON.parse(savedProgress))
      } catch (e) {
        console.warn('无法解析保存的学习进度')
      }
    }
  }

  const loadUserData = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // 加载用户资料
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileData) {
        setUserProfile({
          name: profileData.display_name || user.email?.split('@')[0] || '学习者',
          email: user.email || '',
          level: profileData.level || 'beginner',
          totalProgress: profileData.total_progress || 0,
          achievements: profileData.achievements || [],
          bookmarks: profileData.bookmarks || [],
          notes: profileData.notes || {},
        })
      } else {
        // 为新用户创建资料
        const newProfile = {
          ...defaultProfile,
          email: user.email || '',
          name: user.email?.split('@')[0] || '学习者',
        }
        setUserProfile(newProfile)
        await createUserProfile(newProfile)
      }

      // 加载学习进度
      const { data: progressData } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id)

      if (progressData && progressData.length > 0) {
        const progress: LearningProgress = {}
        progressData.forEach(item => {
          progress[item.item_id] = {
            completed: item.completed,
            completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
            progress: item.progress
          }
        })
        setLearningProgress(progress)
      }
    } catch (error) {
      console.error('加载用户数据时出错:', error)
      // 回退到本地数据
      loadLocalData()
    } finally {
      setIsLoading(false)
    }
  }

  const createUserProfile = async (profile: UserProfile) => {
    try {
      await supabase.from('user_profiles').insert({
        user_id: user?.id,
        display_name: profile.name,
        level: profile.level,
        total_progress: profile.totalProgress,
        achievements: profile.achievements,
        bookmarks: profile.bookmarks,
        notes: profile.notes,
      })
    } catch (error) {
      console.error('创建用户资料时出错:', error)
    }
  }

  const saveUserProfile = async () => {
    if (!user) return
    
    try {
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          display_name: userProfile.name,
          level: userProfile.level,
          total_progress: userProfile.totalProgress,
          achievements: userProfile.achievements,
          bookmarks: userProfile.bookmarks,
          notes: userProfile.notes,
          updated_at: new Date().toISOString(),
        })
    } catch (error) {
      console.error('保存用户资料时出错:', error)
    }
  }

  const saveLearningProgress = async () => {
    if (!user) return
    
    try {
      // 删除现有进度记录
      await supabase
        .from('learning_progress')
        .delete()
        .eq('user_id', user.id)

      // 插入新的进度记录
      const progressArray = Object.entries(learningProgress).map(([itemId, progress]) => ({
        user_id: user.id,
        item_id: itemId,
        completed: progress.completed,
        completed_at: progress.completedAt?.toISOString(),
        progress: progress.progress,
      }))

      if (progressArray.length > 0) {
        await supabase
          .from('learning_progress')
          .insert(progressArray)
      }
    } catch (error) {
      console.error('保存学习进度时出错:', error)
    }
  }

  const syncData = async () => {
    if (user) {
      await loadUserData()
    }
  }

  const updateProgress = (itemId: string, progress: number, completed: boolean = false) => {
    setLearningProgress(prev => ({
      ...prev,
      [itemId]: {
        completed,
        completedAt: completed ? new Date() : prev[itemId]?.completedAt,
        progress: Math.min(100, Math.max(0, progress))
      }
    }))
  }

  const addBookmark = (resourceId: string) => {
    setUserProfile(prev => ({
      ...prev,
      bookmarks: [...prev.bookmarks.filter(id => id !== resourceId), resourceId]
    }))
  }

  const removeBookmark = (resourceId: string) => {
    setUserProfile(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(id => id !== resourceId)
    }))
  }

  const addNote = (resourceId: string, note: string) => {
    setUserProfile(prev => ({
      ...prev,
      notes: { ...prev.notes, [resourceId]: note }
    }))
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }))
  }

  return (
    <LearningContext.Provider value={{
      userProfile,
      learningProgress,
      updateProgress,
      addBookmark,
      removeBookmark,
      addNote,
      updateProfile,
      syncData,
      isLoading
    }}>
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}
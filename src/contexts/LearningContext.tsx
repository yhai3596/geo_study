import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile)
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({})

  // 从localStorage加载数据
  useEffect(() => {
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
  }, [])

  // 保存到localStorage
  useEffect(() => {
    localStorage.setItem('geo-learning-profile', JSON.stringify(userProfile))
  }, [userProfile])

  useEffect(() => {
    localStorage.setItem('geo-learning-progress', JSON.stringify(learningProgress))
    
    // 计算总进度
    const totalItems = Object.keys(learningProgress).length
    const completedItems = Object.values(learningProgress).filter(item => item.completed).length
    const totalProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    
    setUserProfile(prev => ({ ...prev, totalProgress }))
  }, [learningProgress])

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
      updateProfile
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
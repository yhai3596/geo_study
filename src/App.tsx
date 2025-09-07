import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/error-boundary'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import LearningPathsPage from '@/pages/LearningPathsPage'
import ResourcesPage from '@/pages/ResourcesPage'
import ToolsPage from '@/pages/ToolsPage'
import CaseStudiesPage from '@/pages/CaseStudiesPage'
import ProfilePage from '@/pages/ProfilePage'
import ResourceDetailPage from '@/pages/ResourceDetailPage'
import { LearningProvider } from '@/contexts/LearningContext'

function App() {
  return (
    <ErrorBoundary>
      <LearningProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/learning-paths" element={<LearningPathsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/resource/:category/:file" element={<ResourceDetailPage />} />
            </Routes>
          </Layout>
        </Router>
      </LearningProvider>
    </ErrorBoundary>
  )
}

export default App
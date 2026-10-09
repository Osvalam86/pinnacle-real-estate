import { Route, Routes } from 'react-router'
import RootLayout from './layouts/RootLayout.tsx'
import CaseStudyPage from './pages/CaseStudyPage.tsx'
import ContactPage from './pages/ContactPage.tsx'
import HomePage from './pages/HomePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import ProjectDetailsPage from './pages/ProjectDetailsPage.tsx'
import ProjectsPage from './pages/ProjectsPage.tsx'

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="case-study" element={<CaseStudyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App

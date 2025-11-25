import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { awsConfig } from './config/aws-config'
import { AuthProvider } from './context/AuthContext'
import './App.css'
import './styles/animations.css'
import './styles/explore.css'

// ChatBot Component
import ChatBot from './components/chat/ChatBot'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ChangePassword from './components/auth/ChangePassword'
import ResendVerification from './components/auth/ResendVerification'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import ExplorePage from './pages/ExplorePage'
import SeriesManagementPage from './pages/SeriesManagementPage'
import SeriesDetailPage from './pages/SeriesDetailPage'
import InstructorProfile from './pages/InstructorProfile'
import LessonDetailPage from './components/lessons/LessonPage'
import SubscribedSeriesPage from './pages/SubscribeSeriesPage'

// Initialize AWS Amplify with v6 configuration
Amplify.configure(awsConfig);

// Configure token signing for Cognito
cognitoUserPoolsTokenProvider.setKeyValueStorage({
  getItem(key) {
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    localStorage.setItem(key, value);
  },
  removeItem(key) {
    localStorage.removeItem(key);
  }
});

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <Register />
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/verify-email" element={
            <ResendVerification />
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          } />
          <Route path="/series" element={
            <ProtectedRoute>
              <SeriesManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/create-series" element={
            <ProtectedRoute>
              <Navigate to="/series?action=create" replace />
            </ProtectedRoute>
          } />

          {/* Series Routes */}
          <Route path="/series/:seriesId" element={
            <ProtectedRoute>
              <SeriesDetailPage />
            </ProtectedRoute>
          } />

          {/* Instructor Profile Routes */}
          <Route path="/instructor/:instructorId" element={
            <ProtectedRoute>
              <InstructorProfile />
            </ProtectedRoute>
          } />
          <Route path="/instructor/:instructorId/from-series/:seriesId" element={
            <ProtectedRoute>
              <InstructorProfile />
            </ProtectedRoute>
          } />

          {/* Lesson Routes */}
          <Route path="/series/:seriesId/lessons/:lessonId" element={
            <ProtectedRoute>
              <LessonDetailPage />
            </ProtectedRoute>
          } />
          {/* Subscribe Series Routes */}
          <Route path="/subscribe" element={
            <ProtectedRoute>
              <SubscribedSeriesPage />
            </ProtectedRoute>}
          />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* ChatBot Component - Available on all pages */}
        <ChatBot />
      </Router>
    </AuthProvider>
  )
}

export default App
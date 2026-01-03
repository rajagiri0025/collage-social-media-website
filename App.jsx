import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import CollegeSelection from './components/CollegeSelection';
import Login from './components/Login';
import Register from './components/Register';
import OTPVerification from './components/OTPVerification';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Connect from './components/Connect';
import StudyGroups from './components/StudyGroups';
import Events from './components/Events';
import Achievements from './components/Achievements';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import './App.css';

import { StoryProvider } from './context/StoryContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          <StoryProvider>
            <Router>
              <Routes>
                <Route path="/" element={<CollegeSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<OTPVerification />} />

                {/* Protected Routes with MainLayout */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout><Dashboard /></MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <MainLayout><Chat /></MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/connect" element={
                  <ProtectedRoute>
                    <MainLayout><Connect /></MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/groups" element={
                  <ProtectedRoute>
                    <MainLayout><StudyGroups /></MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <MainLayout><Events /></MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/achievements" element={
                  <ProtectedRoute>
                    <MainLayout><Achievements /></MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <MainLayout><Notifications /></MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <MainLayout><Settings /></MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <MainLayout><Profile /></MainLayout>
                  </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </StoryProvider>
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

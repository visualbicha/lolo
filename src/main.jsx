import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuditProvider } from './contexts/AuditContext'
import { VideoProvider } from './contexts/VideoContext'
import { AuthProvider } from './contexts/AuthContext'
import { ReportProvider } from './contexts/ReportContext'
import { StripeProvider } from './contexts/StripeContext'
import { NotificationProvider } from './contexts/NotificationContext'

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AuditProvider>
            <VideoProvider>
              <AuthProvider>
                <StripeProvider>
                  <NotificationProvider>
                    <ReportProvider>
                      <App />
                      <ToastContainer position="bottom-right" />
                    </ReportProvider>
                  </NotificationProvider>
                </StripeProvider>
              </AuthProvider>
            </VideoProvider>
          </AuditProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
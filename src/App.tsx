import './locales/i18n';
import '@fontsource/inter';
import '@fontsource/inter/500.css';
import '@fontsource/inter/500-italic.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/700-italic.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { DirectionProvider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { cssVariablesResolver, mantineTheme } from '@styles/theme';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import InternalServerErrorPage from './pages/InternalServerErrorPage/InternalServerErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import UseCasePage from './pages/UseCasePage/UseCasePage';

export function App() {
  return (
    <DirectionProvider>
      <MantineProvider
        theme={mantineTheme}
        cssVariablesResolver={cssVariablesResolver}
        defaultColorScheme="light"
      >
        <Notifications />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Protected main page */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/use-cases" element={<UseCasePage />} />
              <Route path="/logout" element={<LogoutPage />} />

              {/* Public login page */}
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/internal-server-error"
                element={<InternalServerErrorPage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </DirectionProvider>
  );
}

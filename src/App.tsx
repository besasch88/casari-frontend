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
import MenuCategoryPage from '@pages/MenuCategoryPage/MenuCategoryPage';
import MenuItemPage from '@pages/MenuItemPage/MenuItemPage';
import MenuOptionPage from '@pages/MenuOptionPage/MenuOptionPage';
import OrderPage from '@pages/OrderPage/OrderPage';
import TableListPage from '@pages/TableListPage/TableListPage';
import { cssVariablesResolver, mantineTheme } from '@styles/theme';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import InternalServerErrorPage from './pages/InternalServerErrorPage/InternalServerErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

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
              <Route path="/" element={<Navigate to="/tables" replace />} />
              <Route path="/tables" element={<TableListPage />} />
              <Route path="/tables/:tableId" element={<OrderPage />} />
              <Route path="/menu/categories" element={<MenuCategoryPage />} />
              <Route path="/menu/categories/:menuCategoryId" element={<MenuItemPage />} />
              <Route path="/menu/items/:menuItemId" element={<MenuOptionPage />} />
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

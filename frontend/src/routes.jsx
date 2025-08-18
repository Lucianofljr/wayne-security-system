import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importe todos os seus componentes de página
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage';
// import ResourcesPage from './pages/ResourcesPage';
// import UsersPage from './pages/UsersPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Rota para a página de login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rota para o dashboard */}
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}

      {/* Rota para a página de recursos */}
      {/* <Route path="/resources" element={<ResourcesPage />} /> */}
      
      {/* Rota para a página de usuários */}
      {/*<Route path="/users" element={<UsersPage />} />*/}

      {/* Exemplo: uma rota para tratamento de 404 Not Found */}
      {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}

    </Routes>
  );
}

export default AppRoutes;
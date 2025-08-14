import React from 'react';
import { NavLink } from 'react-router-dom'; // Usamos NavLink para destacar o link ativo
import '../styles/main.css'; // Supondo que você tenha estilos para a sidebar aqui

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/resources" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Recursos
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Usuários
          </NavLink>
        </li>
        {/* Adicione mais links conforme necessário */}
      </ul>
    </aside>
  );
};

export default Sidebar;
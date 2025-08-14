import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css'; // Supondo que você tenha estilos para a navbar aqui

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Minha Aplicação</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/resources">Recursos</Link>
        </li>
        <li>
          <Link to="/users">Usuários</Link>
        </li>
        {/* Você pode adicionar um link para logout ou outras funcionalidades */}
        <li>
          <button onClick={() => console.log('Logout')}>Sair</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
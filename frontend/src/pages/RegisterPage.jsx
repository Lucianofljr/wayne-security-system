import React from 'react'
import { useNavigate } from 'react-router-dom';


function RegisterPage() {
    const navigate = useNavigate()

    return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">BatStage - Registro</h2>

        <form className="login-form">
          {/* Nome */}
          <div className="input-group">
            <label htmlFor="nome">Nome</label>
            <input type="text" id="nome" placeholder="Digite seu nome completo" />
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="Digite seu e-mail" />
          </div>

          {/* Senha */}
          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" placeholder="Crie uma senha" />
          </div>

          {/* Confirmar Senha */}
          <div className="input-group">
            <label htmlFor="confirmar-senha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmar-senha"
              placeholder="Digite a senha novamente"
            />
          </div>

          {/* Botão Registrar */}
          <button type="submit" className="btn-primary">
            Registrar
          </button>
        </form>

        {/* Já tem conta */}
        <p className="register-text">
          Já tem uma conta? <a href="/login">Acesse aqui</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
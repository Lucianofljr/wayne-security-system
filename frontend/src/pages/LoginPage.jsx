import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password)
            localStorage.setItem('token', response.data.access_token)
            navigate('/dashboard')
        } catch (error) {
            console.error('Falha no login:', error)
        }
    };

    return (
        <div className='login-page'>
            <div className='login-container'>
                <h2 className='login-title'>BatStage - Acesso</h2>

                <form className='login-form' onSubmit={handleLogin}>
                    {/* Campo login */}
                    <div className='input-group'>
                        <label htmlFor="login">Login</label>
                        <input type="email" value={email} placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {/* Campo Senha */}
                    <div className='input-group'>
                        <label htmlFor="senha">Senha</label>
                        <input type="password" value={senha} placeholder='Senha' onChange={(e) => setSenha(e.target.value)} />
                    </div>

                    {/* Esqueceu a senha */}
                    <div className='forgot-password'>
                        <a href="#">Esqueceu a senha?</a>
                    </div>

                    {/* Botao de acessar */}
                    <button className='btn-primary' type="submit">Entrar</button>

                </form>
                <p className='register-text'>
                    Não tem conta? <a href="/register">Registrar</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
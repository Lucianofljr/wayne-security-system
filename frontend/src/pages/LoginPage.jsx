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
        <div className='login-page-container'>
            <form onSubmit={handleLogin}>
                <input type="email" value={email} placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} />
                <input type="password" value={senha} placeholder='Senha' onChange={(e) => setSenha(e.target.value)} />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default LoginPage;
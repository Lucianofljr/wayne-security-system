import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';
import { authService } from '../../services/authService';

import styles from './LoginPage.module.css'

interface FormData {
    email: string;
    senha: string;
}

export default function LoginForm() {
    const [form, setForm] = useState<FormData>({
        email: "",
        senha: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { showSuccess, showError } = useAlert();

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const user = await authService.login(form);
            showSuccess('Login realizado com sucesso!', 'Bem vindo')

            setTimeout(() => {
                navigate('/dashboard')
            }   , 1000)

        } catch (error) {
            showError('Erro ao realizar login. Tente novamente.', 'Erro')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name='email'
                placeholder='E-mail'
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name='password'
                placeholder='Senha'
                value={form.senha}
                onChange={handleChange}
                required
            />

            <div className={styles['form-options']}>
                <label>
                    <input type="checkbox" /> Lembrar-me
                </label>
                <a href="">Esqueceu a senha?</a>
            </div>

            <button type='submit'>Acessar</button>
            <p className={styles['create-account']} onClick={() => navigate('/register')}>
                Criar conta
            </p>
        </form>
    )
}
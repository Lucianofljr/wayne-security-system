import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';

import styles from './LoginPage.module.css'


interface FormData {
    name: string;
    cpf: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterForm() {
    const [form, setForm] = useState<FormData>({
        name: "",
        cpf: "",
        email:"",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("Login data:", form)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name='name'
                placeholder='Nome completo'
                value={form.name}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name='cpf'
                placeholder='CPF'
                value={form.cpf}
                onChange={handleChange}
                required
            />

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
                value={form.password}
                onChange={handleChange}
                required
            />

            <input 
                type="password"
                name='verify-password'
                placeholder='Repita a senha'
                value={form.confirmPassword}
            />

            <button type='submit'>Registrar-se</button>
            <p className={styles['create-account']} onClick={() => navigate('/')}>
                Página inicial
            </p>
        </form>
    )
}
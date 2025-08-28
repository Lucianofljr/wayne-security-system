import { useState, type ChangeEvent, type FormEvent } from 'react'

import styles from './LoginPage.module.css'

interface FormData {
    email: string;
    password: string;
}

export default function LoginForm() {
    const [form, setForm] = useState<FormData>({
        email:"",
        password: ""
    });

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

            <div className={styles['form-options']}>
                <label>
                    <input type="checkbox" />Lembrar-me
                </label>
                <a href="">Esqueceu a senha?</a>
            </div>

            <button type='submit'>Acessar</button>
            <p className={styles['create-account']}>Criar conta</p>
        </form>
    )
}
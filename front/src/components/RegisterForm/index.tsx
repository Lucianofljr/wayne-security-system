// front/src/components/RegisterForm/index.tsx
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';
import { authService } from '../../services/authService';
import styles from './LoginPage.module.css'

interface FormData {
    name: string;
    cpf: string;
    email: string;
    senha: string;
    confirmSenha: string;
    cargo: 'admin' | 'gerente' | 'usuario';
}

export default function RegisterForm() {
    const [form, setForm] = useState<FormData>({
        name: "",
        cpf: "",
        email: "",
        senha: "",
        confirmSenha: "",
        cargo: "usuario"
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { showSuccess, showError } = useAlert();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (form.senha !== form.confirmSenha) {
            showError('As senhas não coincidem', 'Erro de Validação');
            return;
        }

        if (form.senha.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres', 'Erro de Validação');
            return;
        }

        setIsLoading(true);
        
        try {
            const registerData = {
                name: form.name,
                cpf: form.cpf,
                email: form.email,
                senha: form.senha,
                cargo: form.cargo
            };

            await authService.register(registerData);
            showSuccess('Conta criada com sucesso!', 'Bem-vindo');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error: any) {
            showError(error.message || 'Erro ao criar conta. Tente novamente.', 'Erro');
        } finally {
            setIsLoading(false);
        }
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
                disabled={isLoading}
            />

            <input
                type="text"
                name='cpf'
                placeholder='CPF'
                value={form.cpf}
                onChange={handleChange}
                required
                disabled={isLoading}
            />

            <input 
                type="email"
                name='email'
                placeholder='E-mail'
                value={form.email}
                onChange={handleChange}
                required
                disabled={isLoading}
            />

            <select
                name="cargo"
                value={form.cargo}
                onChange={handleChange}
                required
                disabled={isLoading}
                style={{
                    width: '100%',
                    padding: '1.4rem',
                    marginBottom: '3rem',
                    border: '3px solid #ddd',
                    borderRadius: '0.8rem',
                    fontSize: '2rem',
                    backgroundColor: 'white'
                }}
            >
                <option value="usuario">Usuário</option>
                <option value="gerente">Gerente</option>
                <option value="admin">Administrador</option>
            </select>

            <input
                type="password"
                name='senha'
                placeholder='Senha'
                value={form.senha}
                onChange={handleChange}
                required
                disabled={isLoading}
            />

            <input 
                type="password"
                name='confirmSenha'
                placeholder='Confirme a senha'
                value={form.confirmSenha}
                onChange={handleChange}
                required
                disabled={isLoading}
            />

            <button type='submit' disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Registrar-se'}
            </button>
            
            <p className={styles['create-account']} onClick={() => navigate('/')}>
                Voltar ao login
            </p>
        </form>
    )
}
import LoginForm from "../../components/LoginForm";
import styles from "../../components/LoginForm/LoginPage.module.css"
import batman from "../../assets/batman.png"

export default function LoginPage() {
    return (
        <div className={styles['container-centralizer']}>
            <div className={styles['login-container']}>
                <div className={styles['login-left']}>
                    <h1>BatGestor</h1>
                    <p>Gerenciador de insumos</p>
                    <img src={batman} alt=""/>
                </div>

                <div className={styles['login-right']}>
                    <h2>Acesse</h2>
                    <LoginForm />
                </div>
            </div>
        </div>

    )
}
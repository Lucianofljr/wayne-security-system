import RegisterForm from "../../components/RegisterForm";
import styles from "../../components/RegisterForm/LoginPage.module.css"
import batman from "../../assets/batman.png"


export function RegisterPage() {
    return (
        <div className={styles['container-centralizer']}>
            <div className={styles['login-container']}>
                <div className={styles['login-left']}>
                    <h1>BatGestor</h1>
                    <p>Gerenciador de insumos</p>
                    <img src={batman} alt=""/>
                </div>

                <div className={styles['login-right']}>
                    <h2>Cadastramento</h2>
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}
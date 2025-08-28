import styles from './NavBar.module.css';

import { 
    LogOut,
    User,
    BookText,
    ChartNoAxesCombined 
} from 'lucide-react';


export function NavBar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles['navbar-brand']}>
                <a href="">Minha Aplicacao</a>
            </div>
            <ul className={styles['navbar-links']}>
                <li>
                    <button>
                        <ChartNoAxesCombined/>
                    </button>
                </li>
                <li>
                    <button>
                        <BookText/>
                    </button>
                </li>
                <li>
                    <button>
                        <User/>
                    </button>
                </li>
                <li>
                    <button>
                        <LogOut/>
                    </button>
                </li>
            </ul>
        </nav>
    )
}
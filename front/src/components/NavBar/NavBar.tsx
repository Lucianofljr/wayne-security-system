import styles from './NavBar.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
    LogOut,
    User,
    BookText,
    ChartNoAxesCombined 
} from 'lucide-react';


export function NavBar() {

    const navigate = useNavigate();
    return (
        <nav className={styles.navbar}>
            <div className={styles['navbar-brand']}>
                <a href="">BatGestor</a>
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
                    <button onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/');
                    }}>
                        <LogOut/>
                    </button>
                </li>
            </ul>
        </nav>
    )
}
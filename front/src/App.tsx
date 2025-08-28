import './styles/theme.css'
import './styles/global.css'
import { RegisterPage } from './pages/Register';
import LoginPage from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';




export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}
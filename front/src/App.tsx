import './styles/theme.css'
import './styles/global.css'
import { RegisterPage } from './pages/Register';
import LoginPage from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AlertProvider } from './contexts/AlertContext';
import { AlertContainer } from './components/AlertContainer/AlertContainer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './components/Dashboard/Dashboard';




export function App() {
    return (
        <ThemeProvider defaultTheme='dark'>
            <AlertProvider maxAlerts={3}>
                <BrowserRouter>
                <div className='app'>
                    <AlertContainer />
                    <Routes>
                        <Route path='/' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route 
                            path='/dashboard'
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
                </BrowserRouter>
            </AlertProvider>
        </ThemeProvider>
    );
}

import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../context/AuthContext';

function PrivateRoute() {
    const auth = useAuth();
    const { user, loading } = auth;

    // Enquanto está carregando, mostra tela de loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl text-gray-600">
                    Verificando autenticação...
                </div>
            </div>
        );
    }

    // Se não tem usuário, redireciona para login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Se tem usuário, renderiza as rotas protegidas
    return <Outlet />;
}

export default PrivateRoute;
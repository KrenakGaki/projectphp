import { createContext, useState, useEffect, useContext } from "react";
import api from '../services/api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    // Configurar token no axios quando ele mudar
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Carregar usuário autenticado
    useEffect(() => {
        if (token) {
            api.get('/me')
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.log('🔴 Erro ao buscar usuário:', error);
                    setToken(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            setToken(response.data.token);
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            token,
            isAuthenticated: !!user,
            isAdmin: () => user?.type === 'admin',
            isUser: () => user?.type === 'user' || user?.type === null || user?.type === undefined
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o contexto
function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}

export { AuthProvider };
export default useAuth;
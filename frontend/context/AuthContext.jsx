import { createContext, useState, useEffect, useContext } from "react";
import api from '../services/api';

const AuthContext = createContext({});

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => localStorage.getItem('token'));


    // Carregar usuário autenticado
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);}
            else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

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
        const response = await api.post('/login', {email, password});
        setToken(response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            
            isAdmin: () => user?.type === 'admin',
            isUser: () => user?.type === 'user' || user?.type === null || user?.type === undefined
        }}>
            {children}
        </AuthContext.Provider>
);
}

export function userAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}   

export default userAuth;
export { AuthProvider };
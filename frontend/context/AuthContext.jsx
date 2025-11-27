import { createContext, useState, useEffect } from "react";
import api from '../services/api';

const AuthContext = createContext({});

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log('🔵 AuthProvider renderizou - loading:', loading, 'user:', user);

    // Carregar usuário autenticado
    useEffect(() => {
        async function loadUser() {
            console.log('🟡 Iniciando loadUser...');
            const token = localStorage.getItem('token');
            console.log('🟡 Token encontrado:', token ? 'SIM' : 'NÃO');
            
            if (!token) {
                console.log('🔴 Sem token, finalizando loading...');
                setLoading(false);
                return;
            }

            try {
                console.log('🟢 Buscando usuário na API...');
                const response = await api.get('/me');
                console.log('🟢 Usuário carregado:', response.data);
                setUser(response.data);
            } catch (error) {
                console.log('🔴 Erro ao buscar usuário:', error);
                console.log('🔴 Detalhes do erro:', error.response?.data);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                console.log('✅ Finalizando loading...');
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            console.log('🔑 Tentando login...');
            const response = await api.post('/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(user);
            console.log('✅ Login realizado com sucesso!', user);
            
            return { success: true };
        } catch (error) {
            console.error('❌ Erro no login:', error.response?.data);
            return {
                success: false,
                error: error.response?.data?.message || 'Erro ao fazer login'
            };
        }
    };

    const logout = async () => {
        try {
            console.log('👋 Fazendo logout...');
            await api.post('/logout');
        } catch (error) {
            console.error('❌ Erro ao fazer logout:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            console.log('✅ Logout concluído');
        }
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

export {AuthProvider};
export default AuthContext;

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import useAuth from '../context/AuthContext';

function Login() {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [erro,     setErro]     = useState(''); 
    const [loading,  setLoading]  = useState(false);

    const { login }  = useAuth();
    const navigate   = useNavigate();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Erro completo:', err);

            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setErro(firstError);
            } else if (err.response?.data?.message) {
                setErro(err.response.data.message);
            } else {
                setErro('Email ou senha incorretos');
            }
        } finally {
            setLoading(false);
        }
    }, [email, password, login, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

                <div className="flex items-center justify-center mb-8">
                    <div className="bg-blue-500 p-3 rounded-full">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Bem-vindo
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Faça login para continuar
                </p>

                {erro && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <p className="text-sm">{erro}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="seu@email.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Login;
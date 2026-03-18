import { Package, Users, ShoppingCart, FileText, LogOut, Home } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';
import api from '../services/api';

function Dashboard() {
    const { user, logout, isAdmin } = useAuth();
    const navigate  = useNavigate();
    const admin     = isAdmin();

    const [loading, setLoading] = useState(true);
    const [erro,    setErro]    = useState(null);
    const [dados,   setDados]   = useState(null);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleLogout = useCallback(async () => {
        await logout();
        navigate('/');
    }, [logout, navigate]);

    // ── Dados ─────────────────────────────────────────────────────────────────

    const carregarDados = useCallback(async () => {
        setLoading(true);
        setErro(null);
        try {
            const res = await api.get('/dashboard');
            setDados(res.data);
        } catch (err) {
            console.error('Erro ao carregar dados', err);
            setErro('Erro ao carregar dados do Dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    // ── Estados de carregamento / erro ────────────────────────────────────────

    if (!user) {
        navigate('/');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Carregando...</p>
                </div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">{erro}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={carregarDados}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            Tentar novamente
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Voltar ao login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <div className="bg-white shadow-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl shadow-lg">
                                <Home className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Bem-vindo de volta,{' '}
                                    <span className="font-semibold text-gray-700">{user.name}</span>
                                    {admin && (
                                        <span className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                                            ADMIN
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
                        >
                            <LogOut className="w-5 h-5" />
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Produtos', valor: dados?.totalProdutos, cor: 'purple', Icon: Package },
                        { label: 'Clientes', valor: dados?.totalClientes, cor: 'blue',   Icon: Users },
                        { label: 'Vendas',   valor: dados?.totalVendas,   cor: 'green',  Icon: ShoppingCart },
                    ].map(({ label, valor, cor, Icon }) => (
                        <div
                            key={label}
                            className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 border-${cor}-500 hover:shadow-xl transition-all`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">{label}</p>
                                    <p className="text-3xl font-bold text-gray-800">{valor ?? '—'}</p>
                                </div>
                                <div className={`p-4 bg-${cor}-100 rounded-xl`}>
                                    <Icon className={`w-10 h-10 text-${cor}-600`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Acesso Rápido */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Acesso Rápido</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[
                        {
                            rota: '/vendas',
                            gradiente: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
                            Icon: ShoppingCart,
                            titulo: 'Vendas',
                            subtitulo: 'Registrar vendas',
                        },
                        {
                            rota: '/produtos',
                            gradiente: 'from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700',
                            Icon: Package,
                            titulo: 'Produtos',
                            subtitulo: 'Gerenciar produtos',
                        },
                        {
                            rota: '/clientes',
                            gradiente: 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
                            Icon: Users,
                            titulo: 'Clientes',
                            subtitulo: 'Gerenciar clientes',
                        },
                        {
                            rota: '/usuarios',
                            gradiente: 'from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800',
                            Icon: FileText,
                            titulo: 'Usuários',
                            subtitulo: 'Gerenciar usuários',
                        },
                    ].map(({ rota, gradiente, Icon, titulo, subtitulo }) => (
                        <button
                            key={rota}
                            onClick={() => navigate(rota)}
                            className={`bg-gradient-to-br ${gradiente} text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center`}
                        >
                            <Icon className="w-12 h-12 mb-3" />
                            <p className="font-bold text-lg">{titulo}</p>
                            <p className="text-sm opacity-90">{subtitulo}</p>
                        </button>
                    ))}
                </div>

                {/* Informações da Conta */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Informações da Conta</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                        <p><span className="font-semibold">Nome:</span> {user.name}</p>
                        <p><span className="font-semibold">Email:</span> {user.email}</p>
                        <p>
                            <span className="font-semibold">Tipo:</span>
                            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                admin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {admin ? 'Administrador' : 'Usuário'}
                            </span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
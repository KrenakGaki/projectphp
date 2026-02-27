import { 
    Package, Users, ShoppingCart, TrendingUp, DollarSign, 
    LogOut, Menu, X, Bell, Search, Calendar, ArrowUp, ArrowDown,
    FileText, BarChart3, Home
} from 'lucide-react';
import useAuth from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useState, useEffect } from 'react';

function Dashboard() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // Dados
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [vendas, setVendas] = useState([]);
    const [vendasRecentes, setVendasRecentes] = useState([]);

    // Métricas calculadas
    const [metricas, setMetricas] = useState({
        receitaTotal: 0,
        receitaHoje: 0,
        lucroTotal: 0,
        ticketMedio: 0,
        crescimento: 0
    });

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    useEffect(() => { 
        const carregarDados     = async () => {
            setLoading(true);
            try {
                const [resClientes, resProdutos, resVendas] = await Promise.all([
                    api.get('/clientes'),
                    api.get('/produtos'),
                    api.get('/vendas'),
                ]);

                setClientes(resClientes.data);
                setProdutos(resProdutos.data);
                setVendas(resVendas.data);

                // Pegar últimas 5 vendas
                const ultimasVendas = resVendas.data.slice(-5).reverse();
                setVendasRecentes(ultimasVendas);

                // Calcular métricas
                calcularMetricas(resVendas.data);
            } catch (error) {
                console.error('Erro ao carregar dados', error);
                setError('Erro ao carregar dados do Dashboard');
            } finally {
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    const calcularMetricas = (vendas) => {
        const hoje = new Date().toISOString().split('T')[0];
        
        const receitaTotal = vendas.reduce((acc, venda) => 
            acc + (parseFloat(venda.valor_total) || 0), 0
        );
        
        const vendasHoje = vendas.filter(v => 
            v.data_venda?.startsWith(hoje)
        );
        
        const receitaHoje = vendasHoje.reduce((acc, venda) => 
            acc + (parseFloat(venda.valor_total) || 0), 0
        );

        const lucroTotal = vendas.reduce((acc, venda) => 
            acc + (parseFloat(venda.lucro_total) || 0), 0
        );

        const ticketMedio = vendas.length > 0 ? receitaTotal / vendas.length : 0;

        // Crescimento simulado (comparar com mês anterior)
        const crescimento = Math.random() * 30 - 5; // Simulado

        setMetricas({
            receitaTotal,
            receitaHoje,
            lucroTotal,
            ticketMedio,
            crescimento
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-xl text-white">Carregando...</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-xl text-white">Carregando dados...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    // Dados para cards
    const statsCards = [
        {
            title: 'Receita Total',
            value: `R$ ${metricas.receitaTotal.toFixed(2)}`,
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            change: metricas.crescimento,
            changeText: 'vs mês anterior'
        },
        {
            title: 'Receita Hoje',
            value: `R$ ${metricas.receitaHoje.toFixed(2)}`,
            icon: TrendingUp,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            change: 12.5,
            changeText: 'vs ontem'
        },
        {
            title: 'Lucro Total',
            value: `R$ ${metricas.lucroTotal.toFixed(2)}`,
            icon: BarChart3,
            color: 'from-purple-500 to-fuchsia-600',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            change: 8.3,
            changeText: 'margem'
        },
        {
            title: 'Ticket Médio',
            value: `R$ ${metricas.ticketMedio.toFixed(2)}`,
            icon: ShoppingCart,
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            change: -2.1,
            changeText: 'vs média'
        }
    ];

    const quickStats = [
        { label: 'Total Vendas', value: vendas.length, icon: ShoppingCart, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { label: 'Clientes', value: clientes.length, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { label: 'Produtos', value: produtos.length, icon: Package, color: 'text-purple-500', bgColor: 'bg-purple-500/10' }
    ];

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
                
                {/* Header Sidebar - MESMA ALTURA DO TOP BAR */}
                <div className="px-6 py-6 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">Gestão Pro</h2>
                                    <p className="text-xs text-slate-400">Sistema de Gestão</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg shadow-lg transition-all hover:shadow-xl"
                    >
                        <Home className="w-5 h-5" />
                        {sidebarOpen && <span className="font-semibold">Dashboard</span>}
                    </button>
                    <button
                        onClick={() => navigate('/vendas')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {sidebarOpen && <span>Vendas</span>}
                    </button>
                    <button
                        onClick={() => navigate('/produtos')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        {sidebarOpen && <span>Produtos</span>}
                    </button>
                    <button
                        onClick={() => navigate('/clientes')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Users className="w-5 h-5" />
                        {sidebarOpen && <span>Clientes</span>}
                    </button>
                    <button
                        onClick={() => navigate('/usuarios')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        {sidebarOpen && <span>Usuários</span>}
                    </button>
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 border-t border-slate-800">
                    <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'} mb-3`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                                <p className="text-slate-400 text-xs truncate">{user.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${sidebarOpen ? 'gap-2' : 'justify-center'} px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl`}
                    >
                        <LogOut className="w-4 h-4" />
                        {sidebarOpen && <span className="text-sm font-semibold">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                
                {/* Top Bar - MESMA ALTURA DO HEADER SIDEBAR */}
                <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-10">
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gray-700 bg-clip-text text-transparent mb-1">
                                    Dashboard Analytics
                                </h1>
                                <p className="text-slate-400">
                                    Bem-vindo de volta, <span className="text-purple-400 font-semibold">{user.name}</span>
                                    {isAdmin() && (
                                        <span className="ml-3 px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold">
                                            ADMIN
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="bg-slate-800 text-white px-4 py-2 pr-10 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none transition-colors"
                                    />
                                    <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                    <Bell className="w-6 h-6 text-slate-400" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                    <Calendar className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>   

                {/* Content */}
                <div className="p-8 space-y-8">

                    {/* Quick Stats Bar */}
                    <div className="flex gap-4">
                        {quickStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all hover:shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        </div>
                                        <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                            <Icon className={`w-8 h-8 ${stat.color}`} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {statsCards.map((card, index) => {
                            const Icon = card.icon;
                            const isPositive = card.change >= 0;
                            return (
                                <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all hover:transform hover:scale-[1.02]">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 ${card.bgColor} rounded-xl`}>
                                            <Icon className={`w-6 h-6 ${card.iconColor}`} />
                                        </div>  
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                                            isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                            <span className="text-sm font-medium">{Math.abs(card.change).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-1">{card.title}</p>
                                    <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                                    <p className="text-xs text-slate-500">{card.changeText}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Charts & Recent Activity */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* Vendas Recentes */}
                        <div className="xl:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Vendas Recentes</h3>
                                <button 
                                    onClick={() => navigate('/vendas')}
                                    className="text-green-400 hover:text-green-300 text-sm font-semibold transition-colors"
                                >
                                    Ver todas →
                                </button>
                            </div>
                            <div className="space-y-4">
                                {vendasRecentes.length > 0 ? (
                                    vendasRecentes.map((venda, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                                    <ShoppingCart className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">Venda #{venda.id}</p>
                                                    <p className="text-slate-400 text-sm">
                                                        {new Date(venda.data_venda).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-green-400 font-bold text-lg">R$ {parseFloat(venda.valor_total).toFixed(2)}</p>
                                                <p className="text-slate-400 text-sm">
                                                    Lucro: <span className="text-purple-400 font-semibold">R$ {parseFloat(venda.lucro_total || 0).toFixed(2)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-400">
                                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Nenhuma venda recente</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Produtos */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Top Produtos</h3>
                                <button 
                                    onClick={() => navigate('/produtos')}
                                    className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
                                >
                                    Ver todos →
                                </button>
                            </div>
                            <div className="space-y-4">
                                {produtos.slice(0, 5).map((produto, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ${
                                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                                            index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600 text-white' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                            'bg-slate-700 text-slate-300'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{produto.nome}</p>
                                            <p className="text-slate-400 text-xs">Estoque: {produto.estoque} un.</p>
                                        </div>
                                        <p className="text-purple-400 text-sm font-bold">
                                            R$ {parseFloat(produto.preco_venda).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Dashboard;
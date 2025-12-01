import { Package, Users, ShoppingCart, FileText, LogOut, Home } from 'lucide-react';
import useAuth from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {useState, useEffect} from 'react';

// Formação do Dashboard
function Dashboard() {
    const auth = useAuth();
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [loading,setLoading] = useState();
    const [error,setError] = useState();
    
    //Armazenar dados
    const [cliente, setClientes] = useState([]);
    const [produto, setProdutos] = useState([]);
    const [vendas, setVendas] = useState([]);

    console.log('Usuário:', user);
    console.log('É Admin:', isAdmin());

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Chamar a API para trazer os valores
    useEffect(() => { 
        const carregarDados = async () => {
            setLoading(true);
            try {
                const[resClientes, resProdutos, resVendas] = await Promise.all([
                    api.get('/clientes'),
                    api.get('/produtos'),
                    api.get('/vendas'),
              //      api.get('/usuarios')
                ]);

                setClientes(resClientes.data);
                setProdutos(resProdutos.data);
                setVendas(resVendas.data);
               // setUsuarios(resUsuarios.data);
        }
        catch (error) {
            console.error('Erro ao carregar dados', error);
            setError('Erro ao carregar dados do Dashboard');
        } finally {
            setLoading(false);
        }
    }
    carregarDados();
}, []);

    //Contagem
    const totalClientes = cliente.length;
    const totalProdutos = produto.length;
    const totalVendas = vendas.length;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Carregando...</div>
            </div>
        );
    }
    if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl">Carregando dados...</div>
        </div>
    );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

//Frontend
return (
    <div className="min-h-screen bg-gray-100">

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
                    Bem-vindo de volta, <span className="font-semibold text-gray-700">{user.name}</span>
                    {isAdmin() && <span className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">ADMIN</span>}
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

        {/* Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 font-medium">Produtos</p>
                    <p className="text-3xl font-bold text-gray-800">{totalProdutos}</p>
                </div>
                <div className="p-4 bg-purple-100 rounded-xl">
                    <Package className="w-10 h-10 text-purple-600" />
                </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 font-medium">Clientes</p>
                    <p className="text-3xl font-bold text-gray-800">{totalClientes}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-xl">
                    <Users className="w-10 h-10 text-blue-600" />
                </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 font-medium">Vendas Hoje</p>
                    <p className="text-3xl font-bold text-gray-800">{totalVendas}</p>
                </div>
                <div className="p-4 bg-green-100 rounded-xl">
                    <ShoppingCart className="w-10 h-10 text-green-600" />
                </div>
                </div>
            </div>
            </div>

            {/* Acesso Rápido */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Acesso Rápido</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            <button
                onClick={() => navigate('/vendas')}
                className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center"
            >
                <ShoppingCart className="w-12 h-12 mb-3" />
                <p className="font-bold text-lg">Vendas</p>
                <p className="text-sm opacity-90">Registrar vendas</p>
            </button>

            <button
                onClick={() => navigate('/produtos')}
                className="bg-gradient-to-br from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center"
            >
                <Package className="w-12 h-12 mb-3" />
                <p className="font-bold text-lg">Produtos</p>
                <p className="text-sm opacity-90">Gerenciar produtos</p>
            </button>

            <button
                onClick={() => navigate('/clientes')}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center"
            >
                <Users className="w-12 h-12 mb-3" />
                <p className="font-bold text-lg">Clientes</p>
                <p className="text-sm opacity-90">Gerenciar clientes</p>
            </button>

            <button
                onClick={() => navigate('/usuarios')}
                className="bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center relative"
            >
                <FileText className="w-12 h-12 mb-3" />
                <p className="font-bold text-lg">Usuários</p>
                <p className="text-sm opacity-90">Gerenciar usuários</p>
            </button>


            </div>

            {/* Informações da Conta */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Informações da Conta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <p><span className="font-semibold">Nome:</span> {user.name}</p>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Tipo:</span> 
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        isAdmin() ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {isAdmin() ? 'Administrador' : 'Usuário'}
                    </span>
                </p>
            </div>
            </div>

        </div>
        </div>
    );
}

export default Dashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ShoppingCart, Package, CheckCircle, AlertCircle, XCircle, ArrowLeftCircle } from 'lucide-react';
import api from '../services/api';

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [busca, setBusca] = useState('');
  const [notificacao, setNotificacao] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [carregando, setCarregando] = useState(false);

  const mostrarNotificacao = (mensagem, tipo = 'info') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 4000);
  };

  const navigate = useNavigate();

  const buscarProdutos = () => {
    api.get('/produtos')
      .then(res => {
        console.log('Produtos recebidos:', res.data);
        setProdutos(res.data);
      })
      .catch(err => {
        console.error('Erro ao buscar produtos:', err)
      });
  };
  
  const buscarClientes = () => {
    api.get('/clientes')
      .then (res => {
        console.log('Clientes recebidos:', res.data);
        setClientes(res.data);
      })
      .catch (err => {
        console.error('Erro ao buscar clientes:', err)
    });
  };

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    const estoqueDisponivel = produto.quantity || 0;
    
    if (itemExistente) {
      if (itemExistente.quantity < estoqueDisponivel) {
        setCarrinho(carrinho.map(item =>
          item.id === produto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        mostrarNotificacao(`${produto.name} adicionado novamente!`, 'success');
      } else {
        mostrarNotificacao('Estoque insuficiente!', 'warning');
      }
    } else {
      if (estoqueDisponivel > 0) {
        setCarrinho([...carrinho, { 
          ...produto, 
          quantity: 1,
          preco_unitario: produto.sale_price
        }]);
        mostrarNotificacao(`${produto.name} adicionado ao carrinho!`, 'success');
      } else {
        mostrarNotificacao('Produto sem estoque!', 'error');
      }
    }
  };

  const removerDoCarrinho = (id) => {
    const produto = carrinho.find(item => item.id === id);
    setCarrinho(carrinho.filter(item => item.id !== id));
    mostrarNotificacao(`${produto.name} removido do carrinho`, 'info');
  };

  const alterarQuantidade = (id, novaQuantidade) => {
    const produto = produtos.find(p => p.id === id);
    const estoqueDisponivel = produto?.quantity || 0;

    if (novaQuantidade < 1) {
      removerDoCarrinho(id);
      return;
    }

    if (novaQuantidade > estoqueDisponivel) {
      mostrarNotificacao('Quantidade maior que o estoque disponível!', 'warning');
      return;
    }

    setCarrinho(carrinho.map(item =>
      item.id === id ? { ...item, quantity: novaQuantidade } : item
    ));
  };

  useEffect(() => {
    buscarProdutos();
    buscarClientes();
  }, []);

  const finalizarVenda = async () => {
    if (!clienteSelecionado) {
      mostrarNotificacao('Selecione um cliente!', 'warning');
      return;
    }

    if (carrinho.length === 0) {
      mostrarNotificacao('Adicione produtos ao carrinho!', 'warning');
      return;
    }

    setCarregando(true);

    const dadosVenda = {
      customer_id: parseInt(clienteSelecionado),
      total: total,
      status: 'pending',
      products: carrinho.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.preco_unitario
      }))
    };

    console.log('Dados da venda:', dadosVenda);

    try {
      const response = await api.post('/vendas', dadosVenda, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Venda realizada:', response.data);
      
      mostrarNotificacao(`Venda realizada com sucesso! Total: R$ ${total.toFixed(2)}`, 'success');
      
      setCarrinho([]);
      setClienteSelecionado('');
      buscarProdutos();
      
    } catch (err) {
      console.error('Erro completo:', err);
      console.error('Resposta do servidor:', err.response?.data);
      
      let mensagemErro = 'Erro ao realizar venda';
      
      if (err.response?.data?.message) {
        mensagemErro = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const erros = Object.values(err.response.data.errors).flat();
        mensagemErro = erros.join(', ');
      } else if (err.response?.data?.error) {
        mensagemErro = err.response.data.error;
      }
      
      mostrarNotificacao(mensagemErro, 'error');
    } finally {
      setCarregando(false);
    }
  };

  const total = carrinho.reduce((acc, item) => {
    const preco = parseFloat(item.preco_unitario || 0);
    return acc + (preco * item.quantity);
  }, 0);

  const produtosFiltrados = produtos.filter(product =>
    product.name?.toLowerCase().includes(busca.toLowerCase())
  );

  const Notificacao = () => {
    if (!notificacao) return null;

    const icones = {
      success: <CheckCircle className="w-6 h-6" />,
      error: <XCircle className="w-6 h-6" />,
      warning: <AlertCircle className="w-6 h-6" />,
      info: <AlertCircle className="w-6 h-6" />
    };

    const cores = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <div className={`${cores[notificacao.tipo]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}>
          {icones[notificacao.tipo]}
          <p className="flex-1 font-semibold">{notificacao.mensagem}</p>
          <button 
            onClick={() => setNotificacao(null)}
            className="hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Notificacao />
      
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Ponto de Venda
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Sistema rápido de vendas</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="fixed top-5 left-5 z-50 flex items-center gap-2.5 bg-white border-2 border-gray-300 text-gray-800 px-5 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:border-gray-400 hover:bg-gray-50 transform hover:scale-110 transition-all duration-300 group"
            >
              <ArrowLeftCircle className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="hidden sm:block">Dashboard</span>
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Total de produtos: <span className="font-bold text-emerald-600">{produtos.length}</span>
              </p>
              <p className="text-xs text-gray-400">Estoque disponível</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Package className="w-8 h-8 text-emerald-600" />
                Produtos Disponíveis
              </h2>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Buscar produtos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-lg"
              />
            </div>

            {produtosFiltrados.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-xl text-gray-600">
                  {busca ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {produtosFiltrados.map(produto => {
                  const estoque = produto.quantity || 0;
                  const noCarrinho = carrinho.find(item => item.id === produto.id);
                  
                  return (
                    <div
                      key={produto.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden"
                    >
                      {noCarrinho && (
                        <div className="bg-emerald-500 text-white text-center py-2 text-sm font-semibold">
                          ✓ {noCarrinho.quantity} no carrinho
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                            {produto.name}
                          </h3>
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            estoque > 10 
                              ? 'bg-green-100 text-green-700' 
                              : estoque > 0 
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {estoque} un
                          </span>
                        </div>

                        {produto.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{produto.description}</p>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <p className="text-3xl font-bold text-emerald-600">
                            R$ {parseFloat(produto.sale_price || 0).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => adicionarAoCarrinho(produto)}
                          disabled={estoque === 0}
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          {estoque === 0 ? 'Sem Estoque' : 'Adicionar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Carrinho</h2>
                    {carrinho.length > 0 && (
                      <p className="text-emerald-100 text-sm mt-1">{carrinho.length} item(s)</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={clienteSelecionado}
                    onChange={(e) => setClienteSelecionado(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="max-h-96 overflow-y-auto mb-6 space-y-3">
                  {carrinho.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-semibold">Carrinho vazio</p>
                      <p className="text-sm">Adicione produtos para começar</p>
                    </div>
                  ) : (
                    carrinho.map(item => {
                      const preco = parseFloat(item.preco_unitario || 0);
                      const subtotal = preco * item.quantity;
                      
                      return (
                        <div key={item.id} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="font-bold text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                R$ {preco.toFixed(2)} cada
                              </p>
                            </div>
                            <button
                              onClick={() => removerDoCarrinho(item.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                              title="Remover do carrinho"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                              <button
                                onClick={() => alterarQuantidade(item.id, item.quantity - 1)}
                                className="w-8 h-8 border-2 border-emerald-300 rounded-lg font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                              <button
                                onClick={() => alterarQuantidade(item.id, item.quantity + 1)}
                                className="w-8 h-8 border-2 border-emerald-300 rounded-lg font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <p className="font-bold text-emerald-600 text-lg">
                              R$ {subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {carrinho.length > 0 && (
                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-6 bg-emerald-50 p-4 rounded-xl">
                      <span className="text-2xl font-bold text-gray-800">Total:</span>
                      <span className="text-4xl font-bold text-emerald-600">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={finalizarVenda}
                      disabled={!clienteSelecionado || carregando}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-5 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                    >
                      {carregando ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          Finalizar Venda
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Vendas;
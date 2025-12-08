import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ShoppingCart, Package, CheckCircle, AlertCircle, XCircle, ArrowLeftCircle, X } from 'lucide-react';
import api from '../services/api';

const formatarMoedaBRL = (valor) => {
    if (isNaN(valor)) return 'R$ 0,00';
    
    return parseFloat(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [busca, setBusca] = useState('');
  const [notificacao, setNotificacao] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const mostrarNotificacao = (mensagem, tipo = 'info') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 4000);
  };

  const navigate = useNavigate();

  const buscarProdutos = () => {
    api.get('/produtos')
      .then(res => {
        setProdutos(res.data);
      })
      .catch(err => {
        console.error('Erro ao buscar produtos:', err)
      });
  };
  
  const buscarClientes = () => {
    api.get('/clientes')
      .then (res => {
        setClientes(res.data);
      })
      .catch (err => {
        console.error('Erro ao buscar clientes:', err)
    });
  };
  
  const adicionarAoCarrinho = (produto, quantidade) => {
    const q = parseInt(quantidade);
    if (isNaN(q) || q < 1) {
        mostrarNotificacao('A quantidade deve ser um número válido e positivo.', 'error');
        return false;
    }

    const itemExistente = carrinho.find(item => item.id === produto.id);
    const estoqueDisponivel = produto.quantity || 0;
    
    const novaQuantidadeTotal = (itemExistente ? itemExistente.quantity : 0) + q;
    
    if (novaQuantidadeTotal > estoqueDisponivel) {
      mostrarNotificacao(`Estoque insuficiente! Máximo ${estoqueDisponivel} un.`, 'error');
      return false;
    }

    if (itemExistente) {
        setCarrinho(carrinho.map(item =>
          item.id === produto.id
            ? { ...item, quantity: item.quantity + q }
            : item
        ));
        mostrarNotificacao(`${q}x ${produto.name} adicionado(s) novamente!`, 'success');
    } else {
        setCarrinho([...carrinho, { 
          ...produto, 
          quantity: q,
          preco_unitario: produto.sale_price
        }]);
        mostrarNotificacao(`${q}x ${produto.name} adicionado(s) ao carrinho!`, 'success');
    }
    
    return true;
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

  const total = carrinho.reduce((acc, item) => {
    const preco = parseFloat(item.preco_unitario || 0);
    return acc + (preco * item.quantity);
  }, 0);

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
      product: carrinho.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.preco_unitario
      }))
    };

    try {
      await api.post('/vendas', dadosVenda, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      mostrarNotificacao(`Venda realizada com sucesso! Total: ${formatarMoedaBRL(total)}`, 'success');
      
      setCarrinho([]);
      setClienteSelecionado('');
      buscarProdutos();
      setCarrinhoAberto(false);
      
    } catch (err) {
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
      <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
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
      
      <CarrinhoModal
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
        carrinho={carrinho}
        clienteSelecionado={clienteSelecionado}
        clientes={clientes}
        setClienteSelecionado={setClienteSelecionado}
        total={total}
        finalizarVenda={finalizarVenda}
        alterarQuantidade={alterarQuantidade}
        removerDoCarrinho={removerDoCarrinho}
        carregando={carregando}
      />
      
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
        <div className="grid grid-cols-1 gap-8">
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Package className="w-8 h-8 text-emerald-600" />
                Produtos Disponíveis
              </h2>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar produtos..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {produtosFiltrados.map(produto => (
                    <ProdutoCard 
                        key={produto.id}
                        produto={produto}
                        carrinho={carrinho}
                        adicionarAoCarrinho={adicionarAoCarrinho}
                        mostrarNotificacao={mostrarNotificacao}
                    />
                ))}
              </div>
            )}
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
      
      <button
        onClick={() => setCarrinhoAberto(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50"
      >
        <ShoppingCart className="w-6 h-6" />
        {carrinho.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {carrinho.length}
          </span>
        )}
      </button>
    </div>
  );
}

const ProdutoCard = ({ produto, carrinho, adicionarAoCarrinho, mostrarNotificacao }) => {
    const [quantidade, setQuantidade] = useState('1'); 

    const noCarrinho = carrinho.find(item => item.id === produto.id);
    const estoque = produto.quantity || 0;
    const jaNoCarrinho = noCarrinho ? noCarrinho.quantity : 0;
    const maxAdicionar = estoque - jaNoCarrinho;
    
    const quantidadeNumerica = parseInt(quantidade);
    const quantidadeValida = !isNaN(quantidadeNumerica) && quantidadeNumerica >= 1 && quantidadeNumerica <= maxAdicionar;

    const desabilitado = estoque === 0 || maxAdicionar === 0 || !quantidadeValida;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !desabilitado) {
        handleAdicionar();
        e.preventDefault();
        e.target.blur(); 
      }
    };

    const handleAdicionar = () => {
        if (quantidadeValida) {
            adicionarAoCarrinho(produto, quantidadeNumerica);
        } else if (estoque > 0) {
            mostrarNotificacao(`Quantidade inválida. Digite entre 1 e ${maxAdicionar}.`, 'warning');
        }
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden flex flex-col"
        >
            {noCarrinho && (
                <div className="bg-emerald-500 text-white text-center py-2 text-sm font-semibold flex-shrink-0">
                    ✓ {noCarrinho.quantity} no carrinho
                </div>
            )}
            
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                        {produto.name}
                    </h3>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                        produto.quantity > 10 
                        ? 'bg-green-100 text-green-700' 
                        : produto.quantity > 0 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {produto.quantity || 0} un
                    </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{produto.description}</p>

                <div className="flex items-center justify-between flex-shrink-0">
                    <p className="text-3xl font-bold text-emerald-600">
                        {formatarMoedaBRL(produto.sale_price)}
                    </p>
                </div>

                <div className="flex flex-col gap-2 mt-4 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-inner border border-gray-200">
                        <button
                            onClick={() => { 
                                const q = parseInt(quantidade) || 1;
                                const newQ = Math.max(1, q - 1);
                                setQuantidade(newQ.toString());
                            }}
                            disabled={(parseInt(quantidade) || 1) <= 1 || maxAdicionar === 0}
                            className="w-10 h-10 border-2 border-emerald-300 rounded-lg font-bold text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-30"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantidade}
                            onChange={(e) => {
                                setQuantidade(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            min="1"
                            max={maxAdicionar}
                            disabled={maxAdicionar === 0}
                            className={`w-full text-center font-bold text-lg p-1 border-none focus:ring-0 rounded-lg bg-transparent ${!quantidadeValida && quantidade !== "" && quantidade !== "1" ? 'text-red-600' : ''}`}
                            placeholder="Qtd."
                        />
                        <button
                            onClick={() => {
                                const q = parseInt(quantidade) || 0;
                                const newQ = Math.min(maxAdicionar, q + 1);
                                setQuantidade(newQ.toString());
                            }}
                            disabled={quantidadeNumerica >= maxAdicionar || maxAdicionar === 0}
                            className="w-10 h-10 border-2 border-emerald-300 rounded-lg font-bold text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-30"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleAdicionar}
                        disabled={desabilitado}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        {estoque === 0 ? 'Sem Estoque' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CarrinhoModal = ({ isOpen, onClose, carrinho, clienteSelecionado, clientes, setClienteSelecionado, total, finalizarVenda, alterarQuantidade, removerDoCarrinho, carregando }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[9999] flex items-center justify-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg mx-4 h-5/6 flex flex-col overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Carrinho</h2>
              {carrinho.length > 0 && (
                <p className="text-emerald-100 text-sm mt-1">{carrinho.length} item(s)</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
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

          <div className="space-y-3">
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
                          {formatarMoedaBRL(preco)} cada
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
                        {formatarMoedaBRL(subtotal)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {carrinho.length > 0 && (
          <div className="border-t-2 border-gray-200 p-6 flex-shrink-0">
            <div className="flex justify-between items-center mb-6 bg-emerald-50 p-4 rounded-xl">
              <span className="text-2xl font-bold text-gray-800">Total:</span>
              <span className="text-4xl font-bold text-emerald-600">
                {formatarMoedaBRL(total)}
              </span>
            </div>

            <button
              onClick={finalizarVenda}
              disabled={!clienteSelecionado || carregando}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
  );
};

export default Vendas;
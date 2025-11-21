import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, Package, X } from 'lucide-react';
import api from '../services/api';

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');

  const buscarProdutos = () => {
    api.get('/produtos').then(res => setProdutos(res.data));
  };

  const buscarClientes = () => {
    api.get('/clientes').then(res => setClientes(res.data));
  };

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
      if (itemExistente.quantidade < produto.quantidade) {
        setCarrinho(carrinho.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        ));
      } else {
        alert('Estoque insuficiente!');
      }
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  useEffect(() => {
    buscarProdutos();
    buscarClientes();
  }, []);

  const finalizarVenda = () => {
    if (!clienteSelecionado) {
      alert('Selecione um cliente!');
      return;
    }

    if (carrinho.length === 0) {
      alert('Adicione produtos ao carrinho!');
      return;
    }

    const venda = {
      cliente_id: clienteSelecionado,
      produtos: carrinho.map(item => ({
        produto_id: item.id,
        quantidade: item.quantidade,
      }))
    };

    
    api.post('/vendas', venda)
      .then(() => {
        alert('Venda realizada com sucesso!');
        setCarrinho([]);
        setClienteSelecionado('');
        buscarProdutos(); // Atualiza estoque
      })
      .catch(err => {
        console.error('Erro:', err);
        alert('Erro ao realizar venda');
      });
  };

  const total = carrinho.reduce((acc, item) => 
    acc + (item.preco * item.quantidade), 0
  );

return (
  <div className="min-h-screen bg-gray-50">
    {/* Cabeçalho Premium Verde (igual ao de Produtos, só muda a cor) */}
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
          <div className="text-right">
            <p className="text-sm text-gray-500">Total de produtos: <span className="font-bold text-emerald-600">{produtos.length}</span></p>
            <p className="text-xs text-gray-400">Estoque disponível</p>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna 1 e 2: Produtos Disponíveis */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Package className="w-8 h-8 text-emerald-600" />
            Produtos Disponíveis
          </h2>

          {produtos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <p className="text-xl text-gray-600">Nenhum produto cadastrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {produtos.map(produto => (
                <div
                  key={produto.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                        {produto.nome}
                      </h3>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        produto.quantidade > 10 
                          ? 'bg-green-100 text-green-700' 
                          : produto.quantidade > 0 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {produto.quantidade} un
                      </span>
                    </div>

                    {produto.descricao && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{produto.descricao}</p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-3xl font-bold text-emerald-600">
                        R$ {parseFloat(produto.preco_venda || produto.preco).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => adicionarAoCarrinho(produto)}
                      disabled={produto.quantidade === 0}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna 3: Carrinho (fixo no desktop) */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Cabeçalho do Carrinho */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Carrinho de Compras</h2>
              </div>
              {carrinho.length > 0 && (
                <p className="text-emerald-100 text-sm mt-2">{carrinho.length} item(s)</p>
              )}
            </div>

            <div className="p-6">
              {/* Seleção de Cliente */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Cliente</label>
                <select
                  value={clienteSelecionado}
                  onChange={(e) => setClienteSelecionado(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} {cliente.cpf && `- ${cliente.cpf}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Itens do Carrinho */}
              <div className="max-h-96 overflow-y-auto mb-6 space-y-3">
                {carrinho.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Carrinho vazio</p>
                    <p className="text-sm">Adicione produtos para começar</p>
                  </div>
                ) : (
                  carrinho.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{item.nome}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantidade}x R$ {parseFloat(item.preco_venda || item.preco).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-emerald-600 text-lg">
                          R$ {(item.quantidade * parseFloat(item.preco_venda || item.preco)).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removerDoCarrinho(item.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total e Finalizar */}
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-gray-800">Total:</span>
                  <span className="text-4xl font-bold text-emerald-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={finalizarVenda}
                  disabled={carrinho.length === 0 || !clienteSelecionado}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-5 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finalizar Venda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Vendas;
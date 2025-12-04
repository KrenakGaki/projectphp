<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Gestão de Produtos</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-linear-to-br from-violet-50 via-purple-50 to-fuchsia-50">

    <!-- Loading -->
    <div id="loading" class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <div class="relative w-20 h-20 mx-auto mb-6">
                <div class="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p class="text-xl text-gray-700 font-semibold">Carregando produtos...</p>
        </div>
    </div>

    <!-- Content -->
    <div id="content" style="display: none;">
        <!-- Header -->
        <div class="bg-white shadow-lg border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="p-3 bg-linear-to-br from-purple-500 to-fuchsia-600 rounded-xl shadow-lg">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold bg-linear-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                                Gestão de Produtos
                            </h1>
                            <p class="text-sm text-gray-500 mt-0.5">Sistema inteligente de controle</p>
                        </div>
                    </div>
                    <button onclick="window.location.href='/dashboard'" class="fixed top-5 left-5 z-50 flex items-center gap-2.5 bg-white border-2 border-gray-300 text-gray-800 px-5 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:border-gray-400 hover:bg-gray-50 transform hover:scale-110 transition-all duration-300">
                        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"/>
                        </svg>
                        <span class="hidden sm:block">Dashboard</span>
                    </button>
                    <button onclick="abrirModal()" class="flex items-center gap-2 bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Novo Produto
                    </button>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Cards de Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 font-medium mb-1">Total de Produtos</p>
                            <p id="totalProdutos" class="text-3xl font-bold text-gray-800">0</p>
                        </div>
                        <div class="p-4 bg-purple-100 rounded-xl">
                            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 font-medium mb-1">Valor Total</p>
                            <p id="valorTotal" class="text-3xl font-bold text-gray-800">R$ 0,00</p>
                        </div>
                        <div class="p-4 bg-green-100 rounded-xl">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 font-medium mb-1">Estoque Total</p>
                            <p id="estoqueTotal" class="text-3xl font-bold text-gray-800">0</p>
                        </div>
                        <div class="p-4 bg-blue-100 rounded-xl">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Barra de Pesquisa -->
            <div class="mb-8">
                <div class="relative max-w-md">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input type="text" id="searchInput" placeholder="Pesquisar produtos..." class="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm">
                </div>
            </div>

            <!-- Lista de Produtos -->
            <div id="produtosLista" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

            <!-- Empty State -->
            <div id="emptyState" style="display: none;" class="bg-white rounded-2xl shadow-xl p-16 text-center">
                <div class="w-24 h-24 bg-linear-to-br from-purple-100 to-fuchsia-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-700 mb-3">Nenhum produto cadastrado</h3>
                <p class="text-gray-500 mb-8 text-lg">Comece adicionando seu primeiro produto</p>
                <button onclick="abrirModal()" class="bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Adicionar Primeiro Produto
                </button>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div id="modal" style="display: none;" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-linear-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white p-6 rounded-t-3xl flex justify-between items-center shadow-lg z-10">
                <div>
                    <h2 id="modalTitle" class="text-2xl font-bold">Novo Produto</h2>
                    <p class="text-purple-100 text-sm mt-1">Preencha os dados do produto</p>
                </div>
                <button onclick="fecharModal()" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <form id="formProduto" class="p-6 space-y-5">
                <input type="hidden" id="produtoId">

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Nome do Produto *</label>
                    <input type="text" id="nome" required class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Ex: Notebook Dell Inspiron">
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
                    <textarea id="descricao" rows="3" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" placeholder="Descreva as características do produto..."></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Preço de Custo (R$) *</label>
                        <input type="number" id="preco_custo" required step="0.01" min="0" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="0.00">
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Preço de Venda (R$) *</label>
                        <input type="number" id="preco_venda" required step="0.01" min="0" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="0.00">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Quantidade *</label>
                    <input type="number" id="quantidade" required min="0" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="0">
                </div>

                <div class="flex gap-3 pt-6">
                    <button type="button" onclick="fecharModal()" class="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                        Cancelar
                    </button>
                    <button type="submit" id="btnSalvar" class="flex-1 px-6 py-4 bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                        Cadastrar
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let produtos = [];
        let editandoId = null;
        const token = localStorage.getItem('auth_token');

        // Buscar produtos
        async function buscarProdutos() {
            try {
                const response = await fetch('http://localhost:8000/api/produtos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                produtos = await response.json();
                renderizarProdutos();
                atualizarEstatisticas();
                document.getElementById('loading').style.display = 'none';
                document.getElementById('content').style.display = 'block';
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao carregar produtos');
            }
        }

        // Renderizar produtos
        function renderizarProdutos() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const produtosFiltrados = produtos.filter(p =>
                p.nome.toLowerCase().includes(searchTerm) ||
                (p.descricao && p.descricao.toLowerCase().includes(searchTerm))
            );

            const lista = document.getElementById('produtosLista');
            const empty = document.getElementById('emptyState');

            if (produtosFiltrados.length === 0) {
                lista.innerHTML = '';
                empty.style.display = 'block';
                return;
            }

            empty.style.display = 'none';
            lista.innerHTML = produtosFiltrados.map(produto => `
                <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                    <div class="h-2 bg-linear-to-r from-purple-500 via-fuchsia-500 to-pink-500"></div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-xl font-bold text-gray-800 flex-1 group-hover:text-purple-600 transition-colors">${produto.nome}</h3>
                            <div class="flex gap-2">
                                <button onclick="editarProduto(${produto.id})" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </button>
                                <button onclick="excluirProduto(${produto.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        ${produto.descricao ? `<p class="text-gray-600 text-sm mb-4 line-clamp-2">${produto.descricao}</p>` : ''}

                        <div class="space-y-3 mb-4">
                            <div class="flex justify-between items-center p-3 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl">
                                <span class="text-gray-600 text-sm font-medium">Custo:</span>
                                <span class="font-bold text-lg text-blue-600">R$ ${parseFloat(produto.preco_custo).toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl">
                                <span class="text-gray-600 text-sm font-medium">Venda:</span>
                                <span class="font-bold text-lg text-green-600">R$ ${parseFloat(produto.preco_venda).toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span class="text-gray-600 text-sm font-medium">Estoque:</span>
                                <span class="font-bold text-lg ${produto.quantidade < 10 ? 'text-red-600' : 'text-gray-700'}">${produto.quantidade} un</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-linear-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                                <span class="text-gray-600 text-sm font-medium">Margem:</span>
                                <span class="font-bold text-lg text-yellow-700">${((produto.preco_venda - produto.preco_custo) / produto.preco_custo * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Atualizar estatísticas
        function atualizarEstatisticas() {
            document.getElementById('totalProdutos').textContent = produtos.length;
            const valorTotal = produtos.reduce((acc, p) => acc + (p.preco_venda * p.quantidade), 0);
            document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            const estoqueTotal = produtos.reduce((acc, p) => acc + p.quantidade, 0);
            document.getElementById('estoqueTotal').textContent = estoqueTotal;
        }

        // Abrir modal
        function abrirModal() {
            document.getElementById('modal').style.display = 'flex';
            document.getElementById('formProduto').reset();
            document.getElementById('produtoId').value = '';
            document.getElementById('modalTitle').textContent = 'Novo Produto';
            document.getElementById('btnSalvar').textContent = 'Cadastrar';
            editandoId = null;
        }

        // Fechar modal
        function fecharModal() {
            document.getElementById('modal').style.display = 'none';
        }

        // Editar produto
        function editarProduto(id) {
            const produto = produtos.find(p => p.id === id);
            if (!produto) return;

            editandoId = id;
            document.getElementById('produtoId').value = id;
            document.getElementById('nome').value = produto.nome;
            document.getElementById('descricao').value = produto.descricao || '';
            document.getElementById('preco_custo').value = produto.preco_custo;
            document.getElementById('preco_venda').value = produto.preco_venda;
            document.getElementById('quantidade').value = produto.quantidade;
            document.getElementById('modalTitle').textContent = 'Editar Produto';
            document.getElementById('btnSalvar').textContent = 'Atualizar';
            document.getElementById('modal').style.display = 'flex';
        }

        // Excluir produto
        async function excluirProduto(id) {
            if (!confirm('Tem certeza que deseja excluir este produto?')) return;

            try {
                await fetch(`http://localhost:8000/api/produtos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                alert('Produto excluído com sucesso!');
                buscarProdutos();
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao excluir produto');
            }
        }

        // Submit form
        document.getElementById('formProduto').addEventListener('submit', async (e) => {
            e.preventDefault();

            const dados = {
                nome: document.getElementById('nome').value,
                descricao: document.getElementById('descricao').value,
                preco_custo: parseFloat(document.getElementById('preco_custo').value),
                preco_venda: parseFloat(document.getElementById('preco_venda').value),
                quantidade: parseInt(document.getElementById('quantidade').value)
            };

            const url = editandoId
                ? `http://localhost:8000/api/produtos/${editandoId}`
                : 'http://localhost:8000/api/produtos';

            const method = editandoId ? 'PUT' : 'POST';

            try {
                await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(dados)
                });

                alert(editandoId ? 'Produto atualizado!' : 'Produto cadastrado!');
                fecharModal();
                buscarProdutos();
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao salvar produto');
            }
        });

        // Pesquisa
        document.getElementById('searchInput').addEventListener('input', renderizarProdutos);

        // Iniciar
        buscarProdutos();
    </script>
</body>
</html>

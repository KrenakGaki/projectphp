<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

    <div class="min-h-screen">
        <!-- Header -->
        <div class="bg-white shadow-lg border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="p-3 bg-linear-to-br from-gray-600 to-gray-800 rounded-xl shadow-lg">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold bg-linear-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p class="text-sm text-gray-500 mt-0.5">
                                Bem-vindo de volta, <span class="font-semibold text-gray-700" id="userName"></span>
                                <span id="adminBadge" class="ml-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full" style="display: none;">ADMIN</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onclick="handleLogout()"
                        class="flex items-center gap-2 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Sair
                    </button>
                </div>
            </div>
        </div>

        <!-- Principal -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <!-- Loading State -->
            <div id="loading" class="text-center py-20">
                <div class="text-xl text-gray-600">Carregando dados...</div>
            </div>

            <!-- Error State -->
            <div id="error" class="text-center py-20 hidden">
                <div class="text-xl text-red-600"></div>
            </div>

            <!-- Content -->
            <div id="content" style="display: none;">
                <!-- Cards de Estatísticas -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <!-- Produtos -->
                    <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 font-medium">Produtos</p>
                                <p class="text-3xl font-bold text-gray-800">{{ $totalProdutos ?? 0 }}</p>
                            </div>
                            <div class="p-4 bg-purple-100 rounded-xl">
                                <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Clientes -->
                    <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 font-medium">Clientes</p>
                                <p class="text-3xl font-bold text-gray-800">{{ $totalClientes ?? 0 }}</p>
                            </div>
                            <div class="p-4 bg-blue-100 rounded-xl">
                                <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Vendas -->
                    <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 font-medium">Vendas Hoje</p>
                                <p class="text-3xl font-bold text-gray-800">{{ $totalVendas ?? 0 }}</p>
                            </div>
                            <div class="p-4 bg-green-100 rounded-xl">
                                <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Acesso Rápido -->
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Acesso Rápido</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    <button
                        onclick="window.location.href='/vendas'"
                        class="bg-linear-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center"
                    >
                        <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <p class="font-bold text-lg">Vendas</p>
                        <p class="text-sm opacity-90">Registrar vendas</p>
                    </button>

                    <button
                        onclick="window.location.href='/produtos'"
                        class="bg-linear-to-br from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center"
                    >
                        <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p class="font-bold text-lg">Produtos</p>
                        <p class="text-sm opacity-90">Gerenciar produtos</p>
                    </button>

                    <button
                        onclick="window.location.href='/clientes'"
                        class="bg-linear-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center"
                    >
                        <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        <p class="font-bold text-lg">Clientes</p>
                        <p class="text-sm opacity-90">Gerenciar clientes</p>
                    </button>

                    <button
                        onclick="window.location.href='/usuarios'"
                        class="bg-linear-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center"
                    >
                        <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <p class="font-bold text-lg">Usuários</p>
                        <p class="text-sm opacity-90">Gerenciar usuários</p>
                    </button>
                </div>

                <!-- Informações da Conta -->
                <div class="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800 mb-6">Informações da Conta</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                        <p><span class="font-semibold">Nome:</span> <span id="userNameInfo"></span></p>
                        <p><span class="font-semibold">Email:</span> <span id="userEmail"></span></p>
                        <p>
                            <span class="font-semibold">Tipo:</span>
                            <span id="userType" class="ml-2 px-3 py-1 rounded-full text-sm font-semibold"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Verificar autenticação e carregar dados do usuário
        document.addEventListener('DOMContentLoaded', async () => {
            const token = localStorage.getItem('auth_token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            // Redirecionar se não estiver autenticado
            if (!token) {
                window.location.href = '/login';
                return;
            }

            // Preencher informações do usuário
            document.getElementById('userName').textContent = user.name || '';
            document.getElementById('userNameInfo').textContent = user.name || '';
            document.getElementById('userEmail').textContent = user.email || '';

            // Verificar se é admin
            const isAdmin = user.type === 'admin';
            if (isAdmin) {
                document.getElementById('adminBadge').style.display = 'inline-block';
                document.getElementById('userType').textContent = 'Administrador';
                document.getElementById('userType').className = 'ml-2 px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700';
            } else {
                document.getElementById('userType').textContent = 'Usuário';
                document.getElementById('userType').className = 'ml-2 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700';
            }

            // Mostrar conteúdo e esconder loading
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        });

        // Função de logout
        async function handleLogout() {
            const token = localStorage.getItem('auth_token');

            try {
                await fetch('http://localhost:8000/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
            } finally {
                // Limpar localStorage e redirecionar
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
    </script>
</body>
</html>

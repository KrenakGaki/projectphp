<!-- resources/views/produtos/index.blade.php -->
@extends('layouts.app')

@section('title', 'Produtos')

@section('content')
<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Lista de Produtos</h1>
        <a href="{{ route('produtos.create') }}"
           class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            + Novo Produto
        </a>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @forelse ($produtos as $produto)
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">{{ $produto->id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ $produto->nome }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">R$ {{ number_format($produto->preco, 2, ',', '.') }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <a href="{{ route('produtos.show', $produto) }}" class="text-indigo-600 hover:text-indigo-900">Ver</a>
                            <a href="{{ route('produtos.edit', $produto) }}" class="ml-4 text-yellow-600 hover:text-yellow-900">Editar</a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                            Nenhum produto cadastrado ainda.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-6">
        {{ $produtos->links() }}
    </div>
</div>
@endsection

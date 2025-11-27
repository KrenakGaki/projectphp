<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VendaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ClienteController;


// ROTAS PÚBLICAS

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// ROTAS ABERTAS
Route::middleware('auth:sanctum')->group(function () {

        // Autenticar usuário
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Produtos
        Route::get('/produtos', [ProdutoController::class, 'index']);
        Route::post('/produtos', [ProdutoController::class, 'store']);
        Route::get('/produtos/{id}', [ProdutoController::class, 'show']);
        Route::put('/produtos/{id}', [ProdutoController::class, 'update']);
        Route::delete('/produtos/{id}', [ProdutoController::class, 'destroy']);

        // Vendas
        Route::get('/vendas', [VendaController::class, 'index']);
        Route::post('/vendas', [VendaController::class, 'store']);
        Route::get('/vendas/{id}', [VendaController::class, 'show']);
        Route::delete('/vendas/{id}', [VendaController::class, 'destroy']);

        // Clientes
        Route::get('/clientes', [ClienteController::class, 'index']);
        Route::post('/clientes', [ClienteController::class, 'store']);
        Route::get('/clientes/{id}', [ClienteController::class, 'show']);
        Route::put('/clientes/{id}', [ClienteController::class, 'update']);
        Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

        // Dashboard do Usuário
        Route::get('/user/dashboard', function (Request $request) {
            return response()->json([
                'message' => 'Bem-vindo ao dashboard!',
                'user' => $request->user(),
            ]);
        });

        // ============================================
        // ROTAS DE ADMINISTRADOR
        // ============================================

        // Dashboard Admin
        Route::get('/admin/dashboard', function (Request $request) {
            return response()->json([
                'message' => 'Bem-vindo ao dashboard de administração!',
                'user' => $request->user(),
            ]);
        });

        // Gerenciar Usuários
        Route::get('/usuarios', function () {
            return response()->json(\App\Models\User::all());
        });

        Route::get('/usuarios/{id}', function ($id) {
            return response()->json(\App\Models\User::findOrFail($id));
        });

        Route::delete('/usuarios/{id}', function ($id) {
            $user = \App\Models\User::findOrFail($id);
            $user->delete();
            return response()->json(['message' => 'Usuário deletado com sucesso.']);
        });

});
/*

    // Cole todas as rotas protegidas aqui
    Route::get('/vendas', [VendaController::class, 'index']);
    // ... etc

*/

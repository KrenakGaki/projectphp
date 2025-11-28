<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\VendaController;
use App\Http\Controllers\UserController;

// ====================
// ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)
// ====================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); // SÓ UMA VEZ, AQUI FORA

// ====================
// ROTAS PROTEGIDAS (COM AUTENTICAÇÃO)
// ====================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Produtos
    Route::apiResource('produtos', ProdutoController::class);

    // Clientes
    Route::apiResource('clientes', ClienteController::class);

    // Vendas
    Route::apiResource('vendas', VendaController::class);

    // Usuários (somente admin)
    Route::apiResource('usuarios', UserController::class)->except(['show']);

    // Dashboard
    Route::get('/dashboard', function (Request $request) {
        return response()->json([
            'message' => 'Bem-vindo!',
            'user' => $request->user(),
        ]);
    });
});

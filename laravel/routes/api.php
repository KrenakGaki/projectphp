<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;

// Rotas públicas (sem autenticação)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rotas protegidas (requer Bearer Token)
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/recent-sales', [DashboardController::class, 'recentSales']);
    Route::get('/dashboard/top-products', [DashboardController::class, 'topProducts']);

    // Customers (clientes)
    Route::apiResource('clientes', CustomerController::class);

    // Products (produtos)
    Route::apiResource('produtos', ProductController::class);

    // Sales (vendas)
    Route::apiResource('vendas', SaleController::class);

    // Users (usuários) - apenas admin
    Route::middleware('check.admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });
});

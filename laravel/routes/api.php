<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ControleProdutoController;
use App\Http\Controllers\ControleClienteController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ClienteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/produtos', [ControleProdutoController::class, 'index']);
Route::post('/produtos', [ControleProdutoController::class, 'store']);
Route::get('/produtos/{id}', [ControleProdutoController::class, 'show']);
Route::put('/produtos/{id}', [ControleProdutoController::class, 'update']);
Route::delete('/produtos/{id}', [ControleProdutoController::class, 'destroy']);


// Clientes
Route::get('/clientes', [ControleClienteController::class, 'index']);
Route::post('/clientes', [ControleClienteController::class, 'store']);
Route::get('/clientes/{id}', [ControleClienteController::class, 'show']);
Route::put('/clientes/{id}', [ControleClienteController::class, 'update']);
Route::delete('/clientes/{id}', [ControleClienteController::class, 'destroy']);

// Api
Route::get('/', [App\Http\Controllers\Api\TesteController::class, 'index']);

// Rotas de autenticação

Route::Post('/registrar', [App\Http\Controllers\AuthController::class, 'registrar']);
Route::Post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/perfil', [App\Http\Controllers\AuthController::class, 'perfil']);
Route::middleware('auth:sanctum')->post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);

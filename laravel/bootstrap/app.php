<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Ativa o suporte a API stateful (para o Sanctum funcionar corretamente)
        $middleware->api(prepend: [EnsureFrontendRequestsAreStateful::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Aqui você pode tratar exceções personalizadas se quiser
    })
    ->create();

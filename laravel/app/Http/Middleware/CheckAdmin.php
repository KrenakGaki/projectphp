<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->type === 'admin') {
            return $next($request);
        }

        return response()->json([
            'message' => 'Acesso negado. Apenas admin.'], 403);
    }
}

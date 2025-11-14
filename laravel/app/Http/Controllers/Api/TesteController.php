<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TesteController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'API está funcionando!']);
    }
}

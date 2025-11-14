<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produtos;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ControleProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Produtos::orderBy('id', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric|min:0',
            'quantidade' => 'required|integer|min:0',
        ]);
        $produto = Produtos::create($data);
        return response()->json($produto, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $produto = Produtos::find($id);
        if (!$produto) {
            return response()->json(['message' => 'Produto não encontrado'], 404);
    }
        return response()->json($produto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request$request, string $id)
    {
        $produto = Produtos::find($id);

        if (!$produto) {
            return response()->json(['message' => 'Produto não encontrado'], 404);
        }
        $data = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'descricao' => 'sometimes|nullable|string',
            'preco' => 'sometimes|numeric|min:0',
            'quantidade' => 'sometimes|integer|min:0',
        ]);

        $produto->update($data);
        return response()->json($produto);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $produto = Produtos::find($id);

        if (!$produto) {
            return response()->json(['message' => 'Produto não encontrado'], 404);
    }

    $produto->delete();
    return response()->json(['message' => 'O produto foi removido!']);
    }
}

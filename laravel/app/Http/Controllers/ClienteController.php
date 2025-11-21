<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clientes;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Clientes::orderBy ("id","desc")->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $clientes = Clientes::create($request->all() );
        return response()->json($clientes, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $cliente = Clientes::findOrFail($id);
        return response()->json($cliente);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $clientes = Clientes::findOrFail($id);
        $clientes->update($request->all());
        return response()->json($clientes);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Clientes::destroy($id);
        return response()->noContent();
    }
}

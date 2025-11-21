<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Venda;
use App\Models\VendaItem;
use App\Models\Produtos;
use Illuminate\Support\Facades\DB;


//Corpo Inicial do Controller
class VendaController extends Controller
{
    public function index() {
        try {
            $vendas = Venda::with(['cliente', 'itens.produto'])
                ->orderBy('data_venda', 'desc')
                ->get();
            return response()->json($vendas, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar vendas'], 500);
        }
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'produtos' => 'required|array|min:1',
            'produtos.*.produto_id' => 'required|exists:produtos,id',
            'produtos.*.quantidade' => 'required|integer|min:1',
        ]);

        //Configuração da transação
        DB::beginTransaction();
        try {
            $venda = Venda::create([
                'cliente_id' => $validated['cliente_id'],
                'total' => 0,
                'data_venda' => now()
            ]);

            $total = 0;

            //Agora fazer o processo dos itens
            foreach ($validated['produtos'] as $item) {
                $produto = Produtos::findOrFail(($item['produto_id']));

                //Fazer a verificação do estoque
                if ($produto->quantidade < $item['quantidade']) {
                    throw new \Exception(("Estoque insuficiente para o produto:  {$produto->nome}. Disponível: {$produto->quantidade}"));
                }

                // Fazer o calculo do subtotal
                $subtotal = $produto->preco_venda * $item['quantidade'];
                $total += $subtotal;

                //Criar o item da venda
                VendaItem::create([
                    'venda_id' => $venda->id,
                    'produto_id' => $produto->id,
                    'quantidade' => $item['quantidade'],
                    'preco_venda' => $produto->preco_venda,
                    'subtotal' => $subtotal,
                ]);

                // Fazer a baixa do estoque

                $produto->quantidade -=$item['quantidade'];
                $produto->save();
            }

            // Fazer a tualização da venda
            $venda->total = $total;
            $venda->save();

            DB::commit();

            // Retornar a venda com os links
            $venda->load(['cliente', 'itens.produto']);
            return response()->json([
                'message' => 'Venda criada com sucesso',
                'venda' => $venda
            ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Erro ao processar venda',
                    'message' => $e->getMessage()
                ], 400);
        }
    }

    public function show(string $id) {
        try {
            $venda = Venda::with(['cliente', 'itens.produto'])->findOrFail($id);
            return response()->json($venda, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Venda não encontrada'], 404);
        }
    }

    public function destroy (string $id){
        DB::beginTransaction();
        try {
            $venda = Venda::with('itens')->findOrFail ($id);

            // Fazer a restauração do estoque
            foreach ($venda->itens as $item) {
                $produto = Produtos::find($item->produto_id);
                if ($produto) {
                    $produto->quantidade += $item->quantidade;
                    $produto->save();
                }
            }

            //Fazer o delete da venda
            $venda->delete();

            DB::commit();

            return response()->json(['message' => 'Venda removida com sucesso'], 200);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => 'Erro ao remover venda'], 500);
            }
        }
}

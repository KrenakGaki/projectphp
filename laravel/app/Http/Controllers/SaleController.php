<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleRequest;
use App\Models\Sale;
use App\Models\SaleProduct;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class SaleController extends Controller
{
    public function index(): JsonResponse
    {
        $sales = Sale::with(['customer', 'product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($sales);
    }

    public function store(SaleRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $total = 0;

            foreach ($request->product as $item) {
                $product = Product::findOrFail($item['id']);

                if ($product->quantity < $item['quantity']) {
                    throw new \Exception("Estoque insuficiente para: {$product->name}");
                }

                $total += $product->sale_price * $item['quantity'];
            }

            $sale = Sale::create([
                'customer_id' => $request->customer_id,
                'user_id' => $request->user()->id,
                'total' => $total,
                'sold_at' => now(),
            ]);

            foreach ($request->product as $item) {
                $product = Product::findOrFail($item['id']);

                SaleProduct::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'sale_price' => $product->sale_price,
                    'subtotal' => $product->sale_price * $item['quantity'],
                ]);

                $product->decrement('quantity', $item['quantity']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venda realizada com sucesso!',
                'data' => $sale->load(['customer', 'product'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show($id): JsonResponse
    {
        $sale = Sale::with(['customer', 'product'])->findOrFail($id);
        return response()->json($sale);
    }

    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $sale = Sale::with('saleproduct')->findOrFail($id);

            foreach ($sale->saleproduct as $item) {
                Product::find($item->product_id)?->increment('quantity', $item->quantity);
            }

            $sale->delete();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venda cancelada com sucesso!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }
}

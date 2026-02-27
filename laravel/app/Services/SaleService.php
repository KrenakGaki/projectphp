<?php

namespace App\Services;

use App\Repositories\SaleRepository;
use App\Repositories\ProductRepository;
use App\Exceptions\ProductNotFoundException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\SaleNotFoundException;
use Illuminate\Support\Facades\DB;

class SaleService {
    
    protected $saleRepository;
    protected $productRepository;

    public function __construct(SaleRepository $saleRepository, ProductRepository $productRepository)
    {
        $this->saleRepository = $saleRepository;
        $this->productRepository = $productRepository;
    }

    public function getAllSales()
    {
        return $this->saleRepository->getAll();
    }

    public function getSaleById(int $id)
    {
        $sale = $this->saleRepository->findById($id);

        if (!$sale) {
            throw new SaleNotFoundException("Venda com ID {$id} não encontrada");
        }

        return $sale;
    }

    public function createSale(array $data, int $userId)
    {
        DB::beginTransaction();

        try {
            $total = 0;
            $saleProductData = [];

            $productIds = collect($data['product'])->pluck('id')->toArray();
            $products = $this->productRepository->findManyByIds($productIds)->keyBy('id');

            foreach ($data['product'] as $item) {
                $product = $products->get($item['id']);

                if (!$product) {
                    throw new ProductNotFoundException("Produto com ID {$item['id']} não encontrado");
                }

                if ($product->quantity < $item['quantity']) {
                    throw new InsufficientStockException("Estoque insuficiente para o produto: {$product->name}");
                }

                $price = $item['price'] ?? $product->price;
                $subtotal = $price * $item['quantity'];
                $total += $subtotal;

                $saleProductData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'subtotal' => $subtotal,
                    'sold_at' => now()
                ];

                $product->decrement('quantity', $item['quantity']);
            }

            $sale = $this->saleRepository->create([
                'customer_id' => $userId,
                'total' => $total,
                'status' => $data['status'] ?? 'completed',
            ]);

            foreach ($saleProductData as $saleProduct) {
                $sale->saleProducts()->create($saleProduct);
            }

            DB::commit();

            return $sale->load('saleProducts.product');

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function cancelSale(int $id)
    {
        DB::beginTransaction();

        try {
            $sale = $this->saleRepository->findById($id);

            if (!$sale) {
                throw new SaleNotFoundException("Venda com ID {$id} não encontrada");
            }

            
            foreach ($sale->saleProducts as $saleProduct) {
                $saleProduct->product->increment('quantity', $saleProduct->quantity);
            }

            $sale->update(['status' => 'cancelled']);

            DB::commit();

            return $sale;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

}
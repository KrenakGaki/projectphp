<?php

namespace App\Services;

use App\Repositories\SaleRepository;
use App\Models\Product;
use App\Models\SaleProduct;
use App\Exceptions\ProductNotFoundException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\SaleNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;


class SaleService {
    
    protected $saleRepository;
    protected $productRepository;

    public function __construct(SaleRepository $saleRepository, ProductRepository $productRepository)
    {
        $this->saleRepository = $saleRepository;
        $this->productRepository = $productRepository;
    }


    public function createSale(array $data, int $userId) {
        DB::beginTransaction();

        try {
            $total = 0;
            $saleProductData = [];

            $productIds = collect($data['products'])->pluck('product_id')->toArray();

            $products = $this->productRepository->findManyByIds($productIds);

            foreach ($data['products'] as $item) {

                $product = $products->get($item['product_id']);

                if (!$product) {
                    throw new ProductNotFoundException("Product with ID {$item['product_id']} not found");
                }

                if ($product->stock < $item['quantity']) {
                    throw new InsufficientStockException("Insufficient stock for product: {$product->name}");
                }

                $price = $item['price'] ?? $product->price;
                $subtotal = $price * $item['quantity'];
                $total += $subtotal;

                $saleProductData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'subtotal' => $subtotal
                ];

                $product->decrement('stock', $item['quantity']);
            }

            $sale = $this->saleRepository->create([
                'customer_id' => $userId,
                'total' => $total,
                'status' => $data['status'] ?? 'completed',
                'payment_method' => $data['payment_method'] ?? null,
                'notes' => $data['notes'] ?? null
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
}
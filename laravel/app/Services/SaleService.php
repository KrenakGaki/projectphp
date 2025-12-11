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

class SaleService
{
    protected $saleRepository;

    public function __construct(SaleRepository $saleRepository)
    {
        $this->saleRepository = $saleRepository;
    }

    public function getAllSales(): Collection
    {
        return $this->saleRepository->getAll();
    }

    public function getSaleById(int $id)
    {
        $sale = $this->saleRepository->findById($id);
        
        if (!$sale) {
            throw new SaleNotFoundException($id);
        }
        
        return $sale;
    }

    public function createSale(array $data, int $userId)
    {
        return DB::transaction(function () use ($data, $userId) {
            $productIds = array_column($data['product'], 'id');
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');
            
            $total = 0;
            $saleProductsData = [];
            

            foreach ($data['product'] as $item) {
                if (!isset($products[$item['id']])) {
                    throw new ProductNotFoundException($item['id']);
                }
                
                $product = $products[$item['id']];
                
                if ($product->quantity < $item['quantity']) {
                    throw new InsufficientStockException($product->name);
                }
                
                $subtotal = $product->sale_price * $item['quantity'];
                $total += $subtotal;
                
                $saleProductsData[] = [
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'sale_price' => $product->sale_price,
                    'subtotal'   => $subtotal,
                ];
            }
            

            $sale = $this->saleRepository->create([
                'customer_id' => $data['customer_id'],
                'user_id'     => $userId,
                'total'       => $total,
                'sold_at'     => now(),
            ]);
            

            foreach ($saleProductsData as $itemData) {
                $itemData['sale_id'] = $sale->id;
                SaleProduct::create($itemData);
                
                Product::where('id', $itemData['product_id'])
                    ->decrement('quantity', $itemData['quantity']);
            }
            
            return $sale->load(['customer', 'product']);
        });
    }

    public function cancelSale(int $id): void
    {
        DB::transaction(function () use ($id) {
            $sale = $this->saleRepository->findById($id);
            
            if (!$sale) {
                throw new SaleNotFoundException($id);
            }
            
            $sale->load('product');
            
            foreach ($sale->products as $item) {
                Product::where('id', $item->product_id)
                    ->increment('quantity', $item->quantity);
            }
            
            $this->saleRepository->delete($sale);
        });
    }
}
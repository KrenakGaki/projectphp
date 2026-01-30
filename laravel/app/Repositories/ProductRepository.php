<?php

namespace app\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository
{
    public function findManyByIds(array $ids): Collection
    {
        return Product::whereIn('id', $ids)->lockForUpdate()->get()->keyBy('id');
    }

    public function decrementStock(int $productId, int $quantity): void
    {
        Product::where('id', $productId)->decrement('quantity', $quantity);
    }

    public function incrementStock(int $productId, int $quantity): void
    {
        Product::where('id', $productId)->increment('quantity', $quantity);
    }
}
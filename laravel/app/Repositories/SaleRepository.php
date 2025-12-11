<?php

namespace App\Repositories;
use App\Models\Sale;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class SaleRepository
{
    public function getAll(): Collection
    {
        return Sale::with(['customer', 'product'])
            ->orderBy('created_at', 'desc')
            ->get();


    }
    public function findById(int $id): Sale
    {

        return Sale::with(['customer', 'product'])->findOrFail($id);

    }
    public function create(array $data): Sale
    {

        return Sale::create($data);

    }
    public function delete(Sale $sale): bool
    {
        return $sale->delete();
    }
}
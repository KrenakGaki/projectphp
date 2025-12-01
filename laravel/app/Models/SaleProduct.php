<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SaleProduct extends Model
{
    use HasFactory;

    protected $table = 'sale_product';

    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    public function venda()
    {
        return $this->belongsTo(Sale::class);
    }

    public function produto()
    {
        return $this->belongsTo(Product::class, 'produto_id');
    }
}

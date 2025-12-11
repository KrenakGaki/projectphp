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
        'sale_price',
        'subtotal',
    ];

    public function venda()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}

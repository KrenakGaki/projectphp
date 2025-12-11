<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{

    protected $table = "sale";


    protected $fillable = [
        'customer_id',
        'total',
        'data_sale',
        'sold_at'
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'data_sale' => 'datetime'
        ];


    // Link com o modelo Cliente e Itens

    public function customer()
    {
        return $this->belongsTo(Customer::class);

    }

    public function itens() {
        return $this->hasMany(SaleProduct::class);
    }

    public function product()
    {
    return $this->belongsToMany(Product::class, 'sale_product')
        ->withPivot('quantity', 'sale_price', 'subtotal');
    }
}



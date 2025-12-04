<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{

    protected $table = "sale";


    protected $fillable = [
        'cliente_id',
        'total',
        'data_Sale',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'data_sale' => 'datetime'
        ];


    // Link com o modelo Cliente e Itens

    public function cliente()
    {
        return $this->belongsTo(Customer::class);

    }

    public function itens() {
        return $this->hasMany(SaleProduct::class);
    }
}



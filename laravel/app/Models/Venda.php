<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    protected $fillable = [
        'cliente_id',
        'total',
        'data_venda',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'data_venda' => 'datetime'
        ];


    // Link com o modelo Cliente e Itens

    public function cliente()
    {
        return $this->belongsTo(Clientes::class);

    }

    public function itens() {
        return $this->hasMany(VendaItem::class);
    }
}



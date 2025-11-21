<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendaItem extends Model
{
    protected $fillable = [
        'venda_id',
        'produto_id',
        'quantidade',
        'preco_unitario',
        'subtotal',
    ];

    protected $casts = [
        'quantidade' => 'integer',
        'preco_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    //Link com Venda e Produto

    public function venda()
    {
        return $this->belongsTo(Venda::class);
    }
    public function produto()
    {
        return $this->belongsTo(Produtos::class);
    }
}

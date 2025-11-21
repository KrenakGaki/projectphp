<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ControleProdutos extends Model
{
    protected $fillable = [
        'produto_id',
        'tipo',
        'quantidade',
        'observacao',
        'user_id',
    ];

    // Link com o modelo Produtos e User
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

}

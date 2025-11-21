<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produtos extends Model
{
    protected $fillable = [
        'nome',
        'descricao',
        'quantidade',
        'preco_custo',
        'preco_venda',
    ];


    // Link com o modelo ControleProdutos
    public function movimentacao() {
        return $this->hasmany(ControleProdutos::class, 'produto_id');
    }
}

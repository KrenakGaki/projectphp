<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $table = 'product';
    protected $fillable = [
        'name',
        'description',
        'quantity',
        'cost_price',
        'sale_price',
    ];


    // Link com o modelo ControleProdutos
    public function movimentation() {
        return $this->hasmany(ProductMovement::class, 'produto_id');
    }
}

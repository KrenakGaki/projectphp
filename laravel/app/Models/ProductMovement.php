<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductMovement extends Model
{
    protected $table = "product_movement";
    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'note',
        'user_id',
    ];

    // Link com o modelo Produtos e User
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

}

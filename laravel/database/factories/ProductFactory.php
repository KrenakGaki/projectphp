<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $categorias = [
            'Camisetas', 'Calças', 'Jaquetas', 'Tênis', 'Bolsas', 'Relógios',
            'Óculos', 'Bonés', 'Mochilas', 'Cuecas/Boxers', 'Meias', 'Vestidos',
            'Shorts', 'Sutiãs', 'Leggings', 'Moletons', 'Acessórios', 'Eletrônicos',
            'Casa & Decoração', 'Cozinha', 'Fitness'
        ];

        $categoria   = $this->faker->randomElement($categorias);
        $marca       = $this->faker->company;
        $produtoNome = $this->faker->words(2, true);
        $nome        = ucwords("{$marca} {$categoria} {$produtoNome}");

        $custo   = $this->faker->randomFloat(2, 8, 120);
        $markup  = $this->faker->randomElement([1.6, 1.8, 2.0, 2.2, 2.5, 3.0]);

        return [
            'name'        => $nome,
            'description' => $this->faker->sentence(12),
            'quantity'    => $this->faker->numberBetween(0, 500),
            'cost_price'  => $custo,
            'sale_price'  => round($custo * $markup, 2),
        ];
    }
}
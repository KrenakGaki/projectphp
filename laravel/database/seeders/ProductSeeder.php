<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('pt_BR');

        $categorias = [
            'Camisetas', 'Calças', 'Jaquetas', 'Tênis', 'Bolsas', 'Relógios',
            'Óculos', 'Bonés', 'Mochilas', 'Cuecas/Boxers', 'Meias', 'Vestidos',
            'Shorts', 'Sutiãs', 'Leggings', 'Moletons', 'Acessórios', 'Eletrônicos',
            'Casa & Decoração', 'Cozinha', 'Fitness'
        ];

        for ($i = 0; $i < 80; $i++) {
            $categoria   = $faker->randomElement($categorias);
            $marca       = $faker->company;
            $produtoNome = $faker->words(2, true);
            $nome        = ucwords("{$marca} {$categoria} {$produtoNome}");

            $custo = $faker->randomFloat(2, 8, 120);           // custo entre R$8 e R$120
            $markup = $faker->randomElement([1.6, 1.8, 2.0, 2.2, 2.5, 3.0]);
            $precoVenda = round($custo * $markup, 2);

            Product::create([
                'name'        => $nome,
                'description' => $faker->sentence(12),
                'quantity'    => $faker->numberBetween(0, 500),
                'cost_price'  => $custo,
                'sale_price'  => $precoVenda,
            ]);
        }

        $this->command->info('80 produtos reais criados com sucesso usando Faker!');
    }
}

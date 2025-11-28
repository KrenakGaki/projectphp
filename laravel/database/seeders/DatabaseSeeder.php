<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run()
{
    // Usuário admin (não quebra se já existir)
    User::updateOrCreate(
        ['email' => 'admin@email.com'],
        [
            'name' => 'Administrador',
            'password' => bcrypt('Admin01'),
            'type' => 'admin',
        ]
    );

    // Usuário comum (vendedor)
    User::updateOrCreate(
        ['email' => 'vendedor@email.com'],
        [
            'name' => 'Vendedor Padrão',
            'password' => bcrypt('User02'),
            'type' => 'user',
        ]
    );

    // Agora roda os outros seeders sem medo
    $this->call([
        ProdutoSeeder::class,
        ClienteSeeder::class,
        // outros seeders...
    ]);
}
}

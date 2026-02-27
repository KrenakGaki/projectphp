<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE customer RESTART IDENTITY CASCADE');

        Customer::factory()->count(50)->create();

        $this->command->info('50 clientes criados!');
    }
}
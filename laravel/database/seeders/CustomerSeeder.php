<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('pt_BR');

        for ($i = 0; $i < 150; $i++) {
            Customer::create([
                'name'    => $faker->name,
                'email'   => $faker->unique()->safeEmail,
                'cpf'     => $faker->unique()->cpf(false),
                'phone'   => $faker->cellphoneNumber,
                'address' => $faker->streetAddress . ', ' .
                             $faker->city . ', ' .
                             $faker->stateAbbr . ' - ' .
                             $faker->postcode,
            ]);
        }

        $this->command->info('150 clientes criados');
    }
}

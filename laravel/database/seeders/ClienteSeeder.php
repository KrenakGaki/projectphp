<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clientes;
use Faker\Factory as Faker;

class ClienteSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('pt_BR'); // Nomes, CPFs, telefones e endereços 100% brasileiros

        $clientes = [

            ['João Silva', 'joao.silva@gmail.com', '123.456.789-00', '(11) 98765-4321', 'Rua das Flores, 123 - Centro, São Paulo - SP'],
            ['Maria Oliveira', 'maria.oli@hotmail.com', '987.654.321-00', '(21) 99876-5432', 'Av. Atlântica, 500 - Copacabana, Rio de Janeiro - RJ'],
            ['Carlos Santos', 'carlos.santos@outlook.com', '456.789.123-00', '(31) 97654-3210', 'Rua dos Tupis, 88 - Savassi, Belo Horizonte - MG'],
            ['Ana Costa', 'ana.costa@gmail.com', '789.123.456-00', '(41) 99988-7766', 'Rua XV de Novembro, 200 - Batel, Curitiba - PR'],
            ['Pedro Almeida', 'pedro.almeida@yahoo.com', '321.654.987-00', '(51) 98765-1234', 'Av. Borges de Medeiros, 150 - Moinhos de Vento, Porto Alegre - RS'],


            ['Fernanda Lima', 'nanda_lima@hotmail.com', '147.258.369-00', '(19) 99123-4567', 'Rua das Acácias, 45 - Jardim Paulista, Campinas - SP'],
            ['Rafael Mendes', 'rafa.mendes@gmail.com', '258.369.147-00', '(48) 99234-5678', 'Rua Felipe Schmidt, 300 - Centro, Florianópolis - SC'],
            ['Juliana Rocha', 'ju.rocha@live.com', '369.147.258-00', '(85) 98877-6655', 'Av. Beira Mar, 1000 - Meireles, Fortaleza - CE'],
            ['Lucas Pereira', 'lucas.pereira@gmail.com', '159.753.486-00', '(62) 99345-6789', 'Av. Goiás, 500 - Setor Central, Goiânia - GO'],
            ['Camila Souza', 'camila.s2@gmail.com', '753.159.486-00', '(71) 98789-1234', 'Rua Chile, 50 - Comércio, Salvador - BA'],
        ];

        foreach ($clientes as $c) {
            Clientes::create([
                'nome' => $c[0],
                'email' => $c[1],
                'cpf' => $c[2],
                'telefone' => $c[3],
                'endereco' => $c[4],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        for ($i = 0; $i < 40; $i++) {
            Clientes::create([
                'nome' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'cpf' => $faker->unique()->cpf(false), // CPF sem máscara
                'telefone' => $faker->cellphone(false), // Sem máscara
                'endereco' => $faker->streetAddress . ', ' . $faker->city . ' - ' . $faker->stateAbbr,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('50 clientes criados com sucesso!');
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produtos;

class ProdutoSeeder extends Seeder
{
    public function run()
    {
        $produtos = [

            ['Camiseta Básica', 'Camiseta 100% algodão', 150, 25.90, 49.90],
            ['Calça Jeans Slim', 'Calça jeans masculina stretch', 80, 79.90, 139.90],
            ['Moletom Canguru', 'Moletom com capuz e bolso', 90, 69.90, 119.90],
            ['Jaqueta Corta-vento', 'Jaqueta impermeável leve', 45, 89.90, 159.90],
            ['Boné Aba Curva', 'Boné trucker premium', 300, 19.90, 39.90],
            ['Cinto Couro Legítimo', 'Cinto preto com fivela metálica', 120, 35.90, 69.90],
            ['Kit 5 Cuecas Boxer', 'Cueca algodão com elástico', 400, 39.90, 69.90],
            ['Vestido Midi Estampado', 'Vestido leve para o verão', 55, 69.90, 129.90],
            ['Shorts Jeans Destroyed', 'Shorts feminino cintura alta', 130, 49.90, 89.90],
            ['Top Cropped Fitness', 'Top academia com bojo removível', 210, 25.90, 49.90],
            ['Calça Legging Suplex', 'Legging grossa não marca', 190, 39.90, 69.90],
            ['Sutiã Rendado com Bojo', 'Sutiã sustentação reforçada', 160, 29.90, 59.90],
            ['Jaqueta Jeans Oversized', 'Jaqueta feminina destroyed', 70, 89.90, 149.90],
            ['Bolsa Transversal Couro', 'Bolsa pequena com alça regulável', 140, 45.90, 79.90],
            ['Tênis Esportivo Running', 'Tênis amortecimento em gel', 60, 129.90, 219.90],
            ['Tênis Casual Branco', 'Tênis plataforma feminino', 85, 99.90, 169.90],
            ['Chinelo Slide Nuvem', 'Chinelo super macio', 320, 19.90, 39.90],
            ['Sandália Rasteira Strass', 'Sandália feminina brilhante', 180, 35.90, 69.90],
            ['Óculos de Sol Polarizado', 'Proteção UV400 espelhado', 110, 49.90, 89.90],
            ['Relógio Digital Esportivo', 'À prova d\'água 50m', 70, 59.90, 99.90],
            ['Pulseira Couro Trançado', 'Pulseira masculina ajustável', 250, 15.90, 29.90],
            ['Brinco Argola Dourada', 'Argola média antialérgica', 280, 12.90, 24.90],
            ['Colar Pingente Coração', 'Colar banhado a ouro', 200, 19.90, 39.90],
            ['Carteira Masculina Couro', 'Carteira com porta-cartões', 150, 39.90, 69.90],
            ['Fone Bluetooth TWS', 'Fone sem fio com case', 180, 79.90, 149.90],
            ['Carregador Portátil 10000mAh', 'Power bank com 2 saídas', 220, 49.90, 89.90],
            ['Capinha iPhone Silicone', 'Capa aveludada anti-impacto', 350, 15.90, 29.90],
            ['Película de Vidro 9D', 'Película full cover borda preta', 500, 9.90, 19.90],
            ['Mouse Gamer RGB', 'Mouse 7200 DPI 7 botões', 90, 69.90, 119.90],
            ['Headset Gamer 7.1', 'Headset com microfone LED', 110, 89.90, 159.90],
            ['Jogo de Cama Queen 400 fios', 'Lençol com elástico + fronhas', 80, 89.90, 149.90],
            ['Toalha de Banho Gigante', 'Toalha 100% algodão 90x150cm', 130, 29.90, 59.90],
            ['Tapete Sala 2x3m', 'Tapete felpudo antiderrapante', 50, 119.90, 199.90],
            ['Almofada Decorativa 45x45', 'Almofada com enchimento', 220, 19.90, 39.90],
            ['Garrafa Térmica 1L', 'Garrafa inox 24h gelado', 200, 35.90, 69.90],
            ['Cafeteira Elétrica 30 xícaras', 'Cafeteira com jarra térmica', 40, 99.90, 169.90],
            ['Liquidificador 1200W', '8 velocidades + pulsar', 55, 119.90, 189.90],
            ['Mochila Escolar 30L', 'Mochila com compartimento notebook', 95, 69.90, 129.90],
            ['Necessaire Viagem', 'Necessaire com divisórias', 170, 25.90, 49.90],
            ['Luminária LED Touch', 'Luminária 3 tons de luz', 140, 39.90, 69.90],
            ['Ventilador de Mesa 40cm', 'Ventilador 3 velocidades', 75, 79.90, 129.90],
            ['Panela de Pressão 6L', 'Panela elétrica multifuncional', 85, 89.90, 149.90],
            ['Jogo de Facas Profissional', 'Kit 6 peças aço inox', 120, 59.90, 99.90],
            ['Conjunto 10 Potes Herméticos', 'Potes com tampa click', 160, 49.90, 89.90],
            ['Caneca Personalizada 325ml', 'Caneca de cerâmica sublimática', 300, 12.90, 24.90],
            ['Meia Cano Alto Kit 3', 'Meias esportivas algodão', 500, 9.90, 19.90],
            ['Bermuda Tactel Premium', 'Bermuda tactel com bolso', 200, 39.90, 69.90],
            ['Camisa Social Slim', 'Camisa manga longa microfibra', 65, 59.90, 109.90],
        ];

        foreach ($produtos as $p) {
            Produtos::create([
                'nome' => $p[0],
                'descricao' => $p[1],
                'quantidade' => $p[2],
                'preco_custo' => $p[3],
                'preco_venda' => $p[4],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('50 produtos inseridos com sucesso!');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('unit', function (Blueprint $table) {
            $table->id();
            $table->string('unit', 5);
            $table->string('name');
            $table->timestamps();
        });

        DB::table('unit')->insert([
            ['unit' => 'UN', 'name' => 'Unidade', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'CX', 'name' => 'Caixa', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'KG', 'name' => 'Quilos', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'LT', 'name' => 'Litros', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'MT', 'name' => 'Metros', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'PC', 'name' => 'Pacote', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'ML', 'name' => 'Mililitros', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'DZ', 'name' => 'Duzia', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'FD', 'name' => 'Fardo', 'created_at' => NOW(), 'updated_at' => NOW()],
            ['unit' => 'JG', 'name' => 'Jogo', 'created_at' => NOW(), 'updated_at' => NOW()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit');
    }
};

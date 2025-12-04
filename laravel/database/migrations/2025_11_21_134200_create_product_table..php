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
        Schema::create('product', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();                           // evita nome duplicado
            $table->text('description')->nullable();
            $table->unsignedBigInteger('quantity')->default(0);
            $table->decimal('cost_price', 14, 4)->default(0);           // mais precisão
            $table->decimal('sale_price', 14, 4)->default(0);
            $table->boolean('active')->default(true);                   // para ativar/desativar produto
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};

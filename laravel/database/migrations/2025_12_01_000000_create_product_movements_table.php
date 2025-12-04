<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {

        Schema::create('product_movements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->integer('quantity');
            $table->string('type');
            $table->text('observation')->nullable();
            $table->timestamps();
        });

    }

    public function down()
    {
        Schema::dropIfExists('product_movements');
    }
};

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
        Schema::create('album_image', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->references('id')->on('albums')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('image_id')->references('id')->on('images')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('album_image');
    }
};

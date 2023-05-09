<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('segment_buckets', function (Blueprint $table) {
            $table->id();

            $table->string('bucket')->nullable();
            $table->string('processing_bucket')->nullable();

            $table->string('manifest_file')->nullable();
            $table->string('segments_of_file')->nullable();

            $table->foreignId('audio_id')->references('id')->on('audios')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(' segment_buckets');
    }
};

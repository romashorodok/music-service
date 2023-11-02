<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('
            CREATE TRIGGER create_segment_bucket_on_audio_insert
            AFTER INSERT ON audios
            FOR EACH ROW
            BEGIN
             INSERT INTO segment_buckets(audio_id) VALUES (NEW.id);
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('
            DROP TRIGGER IF EXISTS create_segment_bucket_on_audio_insert
        ');
    }
};

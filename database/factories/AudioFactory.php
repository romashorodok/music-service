<?php

namespace Database\Factories;

use Database\Factories\Providers\AudioFileProvider;
use Database\Factories\Providers\AudioTitleProvider;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\File\UploadedFile as SymfonyUploadedFile;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Audio>
 */
class AudioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $audioFile = AudioFileProvider::audioFile();

        return [
            'title' => AudioTitleProvider::audioTitle(),
            'original_audio_file' => UploadedFile::createFromBase(
                new SymfonyUploadedFile($audioFile, $audioFile)
            )
        ];
    }
}

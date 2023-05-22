<?php

namespace Database\Factories;

use Database\Factories\Providers\ImageOriginalFileProvider;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\File\UploadedFile as SymfonyUploadedFile;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $originalImage = ImageOriginalFileProvider::originalFile();

        return [
            'original_image' => UploadedFile::createFromBase(
                new SymfonyUploadedFile($originalImage, $originalImage)
            )
        ];
    }
}

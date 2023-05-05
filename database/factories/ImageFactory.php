<?php

namespace Database\Factories;

use Database\Factories\Providers\ImageOriginalFileProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'original_image' => ImageOriginalFileProvider::originalFile()
        ];
    }
}

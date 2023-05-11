<?php

namespace Database\Factories;

use Database\Factories\Providers\AudioTitleProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'title' => AudioTitleProvider::audioTitle()
        ];
    }
}

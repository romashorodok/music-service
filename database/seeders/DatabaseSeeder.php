<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Audio;
use App\Models\Genre;
use App\Models\Image;
use App\Models\User;
use Database\Factories\Providers\GenreProvider;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (GenreProvider::$genres as $genre) {
            $genre = Genre::factory()->create([
                'name' => $genre
            ]);

            Album::factory(rand(1, 10))->create()->each(function(Album $album) use ($genre) {
                $image = Image::factory()->create();

                $album->images()->attach($image);

                Audio::factory(rand(1, 10))->hasAttached($image)->hasAttached($genre)->hasAttached($album)->create();
            });
        }

        User::factory()->create([
            'name' => 'test@test.test',
            'email' => 'test@test.test',
            'password' => Hash::make('test@test.test')
        ]);
    }
}

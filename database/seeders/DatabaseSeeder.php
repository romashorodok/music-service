<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Audio;
use App\Models\Genre;
use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $images = Image::factory(rand(1, 10))->create();
        $albums = Album::factory(rand(1, 10))->create();
        $genres = Genre::factory(rand(1, 10))->create();

        $albums->each(function (Album $album) use ($images, $genres) {
            $image = $images->random();
            $album->images()->attach($image);

            Audio::factory(rand(1, 10))
                ->hasAttached($album)
                ->hasAttached($image)
                ->hasAttached($genres->random())
                ->create();
        });

        User::factory()->create([
            'name' => 'test@test.test',
            'email' => 'test@test.test',
            'password' => Hash::make('test@test.test')
        ]);
    }
}

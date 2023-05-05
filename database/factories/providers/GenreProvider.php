<?php

namespace Database\Factories\Providers;

use Faker\Provider\Base;

class GenreProvider extends Base
{
    public static array $genres = [
        'Black Metal',
        'Melodic Black Metal',
        'Instrumental Black Metal',
        'Raw Black Metal',
    ];

    public static function genre(): string
    {
        return self::randomElement(self::$genres);
    }
}

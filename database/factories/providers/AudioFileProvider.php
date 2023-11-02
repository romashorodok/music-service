<?php

namespace Database\Factories\Providers;

use Database\Factories\providers\traits\StorageFilesProvider;
use Faker\Provider\Base;

class AudioFileProvider extends Base
{
    use StorageFilesProvider;

    static function audioFile(): string
    {
        return self::randomElement(self::files('audio'));
    }
}

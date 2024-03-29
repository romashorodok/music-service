<?php

namespace Database\Factories\Providers;

use Database\Factories\providers\traits\StorageFilesProvider;
use Faker\Provider\Base;

class ImageOriginalFileProvider extends Base
{
    use StorageFilesProvider;

    static function originalFile(): string
    {
        return self::randomElement(self::files('seed'));
    }
}

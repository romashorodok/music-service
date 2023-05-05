<?php

namespace Database\Factories\Providers;

use Faker\Provider\Base;
use FilesystemIterator;

class ImageOriginalFileProvider extends Base
{
    static function originalFile()
    {
        $sourceFilesPath = storage_path('seed');
        $files = [];

        foreach (new FilesystemIterator($sourceFilesPath) as $file) {
            $files[] = $file->getRealPath();
        }

        return self::randomElement($files);
    }
}

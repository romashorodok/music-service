<?php

namespace App\Utils;

use League\Flysystem\Config;
use League\Flysystem\UrlGeneration\PublicUrlGenerator as FlysystemPublicUrlGenerator;

class PublicUrlGenerator implements FlysystemPublicUrlGenerator
{
    public function __construct(
        private readonly string $publicPath,
        private readonly string $bucket,
    )
    {
    }

    public function publicUrl(string $path, Config $config): string
    {
        return $this->publicPath . "/" . $this->bucket . "/" . $path;
    }
}

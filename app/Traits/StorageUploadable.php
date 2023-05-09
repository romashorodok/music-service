<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemException;

trait StorageUploadable
{

    /**
     * @throws FilesystemException
     */
    private function cleanUp(Filesystem $client, ?string $filename): void
    {
        if ($filename != '') {
            $exists = $client->fileExists($filename);

            if ($exists) {
                Storage::disk($this->disk)->delete($filename);
            }
        }
    }

    /**
     * @throws FilesystemException
     */
    public function upload(string $attribute, ?UploadedFile $source): ?string
    {
        /* @var Filesystem $client */
        $client = Storage::disk($this->disk);
        $filename = $this->attributes[$attribute] ?? null;

        $this->cleanUp($client, $filename);

        if ($source == null) return null;

        $filename = $source->hashName();

        $stream = fopen($source, 'r+');
        $client->writeStream($filename, $stream);
        fclose($stream);

        return $filename;

    }
}

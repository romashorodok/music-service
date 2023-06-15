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
    private function deleteFileIfExist(Filesystem $client, ?string $filename): void
    {
        if ($filename === '' || $filename === null) {
            return;
        }

        $exists = $client->fileExists($filename);

        if ($exists) {
            Storage::disk($this->disk)->delete($filename);
        }
    }

    /**
     * @throws FilesystemException
     */
    public function upload(string $fileAttribute, ?UploadedFile $source): ?string
    {
        /* @var Filesystem $client */
        $client = Storage::disk($this->disk);

        $this->deleteFileIfExist(
            $client,
            $this->attributes[$fileAttribute] ?? null
        );

        if (!$source) {
            return null;
        }

        $source->getErrorMessage();
        $filename = $source->hashName();

        $stream = fopen($source, 'r+');
        $client->writeStream($filename, $stream);
        fclose($stream);

        return $filename;
    }
}

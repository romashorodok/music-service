<?php

namespace Database\Factories\Providers\Traits;
trait StorageFilesProvider
{
    /**
     * @return array<string>
     */
    public static function files(string $dir): array
    {
        $sourceFilesPath = storage_path($dir);
        $files = [];

        foreach (new \FilesystemIterator($sourceFilesPath) as $file) {
            $files[] = $file->getRealPath();
        }

        return $files;
    }
}

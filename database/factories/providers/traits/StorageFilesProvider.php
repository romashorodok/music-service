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
        $blacklistedFileNames = ['.DS_Store', '.gitkeep'];

        foreach (new \FilesystemIterator($sourceFilesPath) as $file) {
            $filename = $file->getFilename();

            if (!in_array($filename, $blacklistedFileNames)) {
                $files[] = $file->getRealPath();
            }
        }

        return $files;
    }
}

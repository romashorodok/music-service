<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Audio;
use App\Models\SegmentBucket;
use Illuminate\Filesystem\FilesystemManager;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemException;

class TranscodeService
{
    private Filesystem $disk;

    public function __construct(
        private readonly SegmentBucket $segmentBucket,

        FilesystemManager              $fs,
    )
    {
        /* @var Filesystem $disk */
        $disk = $fs->disk('minio.segment');

        $this->disk = $disk;
    }

    /**
     * @throws \Exception
     * @throws FilesystemException
     */
    public function successAudioProcessing(int $bucketId, string $bucket, string $manifest, string $audioFile): void
    {
        $segmentBucket = $this->segmentBucket->newQuery()->firstWhere("id", $bucketId);
        $processingBucket = $segmentBucket['processing_bucket'];

        if ($processingBucket == null)
            throw new \Exception("Don't have currently processing bucket");

        if (!$this->disk->directoryExists($bucket))
            throw new \Exception("Bucket doesnt exists");

        /** @var Audio $audio */
        $audio = $segmentBucket->audio()->first();
        $originalFile = $audio->getAttributes()['original_audio_file'];

        if ($originalFile != $audioFile)
            throw new \Exception("Chunks belongs to another file");

        if ($processingBucket != $bucket)
            throw new \Exception("Processing bucket and processed bucket is different. Expect same buckets");

        $oldBucket = $segmentBucket['bucket'];

        $segmentBucket->update([
            'manifest_file' => $manifest,
            'bucket' => $processingBucket,
            'segments_of_file' => $audioFile,
            'processing_bucket' => null,
        ]);

        if ($oldBucket != null || $oldBucket != '')
            $this->disk->deleteDirectory($oldBucket);
    }
}

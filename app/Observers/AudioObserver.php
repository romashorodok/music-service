<?php

namespace App\Observers;

use App\Models\Audio;
use App\Models\SegmentBucket;
use App\Traits\TranscodeAudio;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemException;

class AudioObserver
{
    use TranscodeAudio;

    public function __construct(private readonly Filesystem $fs)
    {
    }

    /**
     * Handle the Audio "created" event.
     * @throws FilesystemException
     */
    public function created(Audio $audio): void
    {
        $this->transcode($audio);
    }

    /**
     * Handle the Audio "updated" event.
     * @throws FilesystemException
     */
    public function updated(Audio $audio): void
    {
        /* @var SegmentBucket $segmentBucket */
        $segmentBucket = $audio->segmentBucket()->get(['segments_of_file', 'bucket', 'manifest_file'])->first();
        $manifest = $segmentBucket['manifest_file'] ?? null;
        $bucket = $segmentBucket['bucket'] ?? null;

        if ($manifest != null && $manifest != '') {
            $exists = $this->fs->fileExists($bucket . "/" . $manifest);

            if (!$exists) {
                $this->transcode($audio);
                return;
            }
        }

        $file = $audio->file();

        if ($file != null && $file != '' && $segmentBucket) {
            $sameSegments = $segmentBucket->segmentsOf($file);

            if ($sameSegments) return;

            $this->transcode($audio);
        }
    }

    /**
     * Handle the Audio "deleted" event.
     */
    public function deleted(Audio $audio): void
    {
        //
    }

    /**
     * Handle the Audio "restored" event.
     */
    public function restored(Audio $audio): void
    {
        //
    }

    /**
     * Handle the Audio "force deleted" event.
     */
    public function forceDeleted(Audio $audio): void
    {
        //
    }
}

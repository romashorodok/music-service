<?php

namespace App\Observers;

use App\Exceptions\TranscodeAudioException;
use App\Models\Audio;
use App\Models\SegmentBucket;
use App\Services\TranscodeService;
use Illuminate\Support\Facades\Log;
use League\Flysystem\FilesystemException;

class AudioObserver
{
    public function __construct(
        private readonly TranscodeService $transcodeService,
    )
    {
    }

    /**
     * Handle the Audio "created" event.
     * @throws FilesystemException
     * @throws TranscodeAudioException
     */
    public function created(Audio $audio): void
    {
        $this->transcodeService->transcode($audio);
    }

    /**
     * Handle the Audio "updated" event.
     */
    public function updated(Audio $audio): void
    {
        /* @var SegmentBucket $segmentBucket */
        $segmentBucket = $audio->segmentBucket()->get(['segments_of_file', 'bucket', 'manifest_file'])->first();
        $manifest = $segmentBucket['manifest_file'] ?? null;
        $bucket = $segmentBucket['bucket'] ?? null;

        try {
            if (empty($manifest) || empty($bucket)) {
                $this->transcodeService->transcode($audio);

                return;
            }

            $processing = $this->transcodeService->transcodeIfManifestNotExists($audio, $bucket, $manifest);

            if ($processing) {
                return;
            }

            $this->transcodeService->transcodeIfSegmentOfAnotherFile($audio);
        } catch (TranscodeAudioException|FilesystemException $e) {
            Log::error($e->getMessage());
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

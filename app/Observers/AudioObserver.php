<?php

namespace App\Observers;

use App\Models\Audio;
use App\Traits\TranscodeAudio;
use League\Flysystem\FilesystemException;

class AudioObserver
{
    use TranscodeAudio;

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
        $segmentBucket = $audio->segmentBucket()->get('segments_of_file')->first();
        $segmentsOfFile = $segmentBucket['segments_of_file'];

        if ($segmentsOfFile == null || $segmentsOfFile == '') return;

        $file = $audio->getAttributes()['original_audio_file'] ?? null;

        if ($file != $segmentsOfFile)
            $this->transcode($audio);
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

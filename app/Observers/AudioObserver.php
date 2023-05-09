<?php

namespace App\Observers;

use App\Models\Audio;
use App\Traits\TranscodeAudio;

class AudioObserver
{
    use TranscodeAudio;

    /**
     * Handle the Audio "created" event.
     */
    public function created(Audio $audio): void
    {
        $this->transcode($audio);
    }

    /**
     * Handle the Audio "updated" event.
     */
    public function updated(Audio $audio): void
    {
        // IF manifest file exists don't transcode and check for what file it transcoded for.
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

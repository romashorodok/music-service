<?php

namespace App\Traits;

use App\Models\Audio;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Junges\Kafka\Facades\Kafka;
use Junges\Kafka\Message\Message;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemException;

trait TranscodeAudio
{
    private static string $TOPIC = 'transcode-audio-topic';

    /**
     * @throws \Exception
     * @throws FilesystemException
     */
    public function transcode(Audio $audio): void
    {
        $audioFile = $audio->getAttributes()['original_audio_file'] ?? null;

        if ($audioFile == null && $audioFile == '') return;

        /* @var Filesystem $client */
        $client = Storage::disk('minio.segment');
        $bucket = Str::random(40);

        while ($client->directoryExists($bucket)) {
            $bucket = Str::random(40);
        }

        $bucketSegment = $audio->segmentBucket()->first();
        $bucketSegment->update(['processing_bucket' => $bucket]);

        $segmentBucket = config('filesystems.disks.minio.segment.bucket');
        $processingBucket = $bucketSegment->processing_bucket;

        $message = new Message(
            body: [
                'bucket_id' => $bucketSegment->id,
                'audio_file' => $audioFile,
                'audio_file_bucket' => config('filesystems.disks.minio.audio.bucket'),
                'segment_bucket' => $segmentBucket,
                'processing_bucket' => $processingBucket
            ],
        );

        $producer = Kafka::publishOn(self::$TOPIC)
            ->withMessage($message);

        $producer->send();
    }
}

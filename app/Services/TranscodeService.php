<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\TranscodeAudioException;
use App\Models\Audio;
use App\Models\SegmentBucket;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Junges\Kafka\Facades\Kafka;
use Junges\Kafka\Message\Message;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemException;

class TranscodeService
{
    private static string $TOPIC = 'transcode-audio-topic';

    public function __construct(
        private readonly Filesystem $fs,
    )
    {
    }

    /**
     * @throws FilesystemException
     * @throws TranscodeAudioException
     */
    public function transcode(Audio $audio): bool
    {
        $audioFile = $audio->getAttributes()['original_audio_file'] ?? null;

        if (empty($audioFile)) {
            throw new TranscodeAudioException("Audio file is not exists");
        }

        $processingBucket = Str::random(40);

        while ($this->fs->directoryExists($processingBucket)) {
            $processingBucket = Str::random(40);
        }

        $audioBucket = $audio->segmentBucket()->first();
        $audioBucket->update(['processing_bucket' => $processingBucket]);

        return $this->sendTranscodeAudioTopic(
            $audioBucket->id,
            $audioFile,
            $processingBucket,
            segmentBucket: config('filesystems.disks.minio.segment.bucket'),
            audioBucket: config('filesystems.disks.minio.audio.bucket')
        );
    }

    /**
     * @throws TranscodeAudioException
     */
    public function sendTranscodeAudioTopic(int $bucketId, string $audioFile, string $processingBucket, string $segmentBucket, string $audioBucket): bool
    {
        $producer = Kafka::publishOn(static::$TOPIC)->withMessage(
            new Message(
                body: [
                    'bucket_id' => $bucketId,
                    'audio_file' => $audioFile,
                    'audio_file_bucket' => $audioBucket,
                    'segment_bucket' => $segmentBucket,
                    'processing_bucket' => $processingBucket
                ]
            )
        );

        try {
            $producer->send();
            return true;
        } catch (\Exception) {
            throw new TranscodeAudioException("Cannot send transcode audio topic");
        }
    }

    /**
     * @throws FilesystemException
     * @throws TranscodeAudioException
     */
    public function transcodeIfManifestNotExists(Audio $audio, string $bucket, string $manifest): bool
    {
        if (!$this->fs->fileExists($bucket . "/" . $manifest)) {
            return $this->transcode($audio);
        }

        return false;
    }

    /**
     * @throws TranscodeAudioException
     * @throws FilesystemException
     */
    public function transcodeIfSegmentOfAnotherFile(Audio $audio): bool
    {
        $file = $audio->file();

        if (empty($file)) {
            return false;
        }

        /* @var SegmentBucket $audioBucket */
        $audioBucket = $audio->segmentBucket()->first();

        $sameFileSegments = $audioBucket->segmentsOf($file);

        if ($sameFileSegments) {
            return false;
        }

        return $this->transcode($audio);
    }

    /**
     * @throws Exception
     * @throws FilesystemException
     */
    public function successAudioProcessing(int $bucketId, string $bucket, string $manifest, string $processingFile): void
    {
        /* @var SegmentBucket $audioBucket */
        $audioBucket = SegmentBucket::query()->firstWhere("id", $bucketId);
        $processingBucket = $audioBucket['processing_bucket'] ?? null;

        if (empty($processingBucket)) {
            throw new Exception("Don't have currently processing bucket");
        }

        /* @var Audio $audio */
        $audio = $audioBucket->audio()->first();
        $file = $audio->file();

        if ($processingFile != $file) {
            throw new Exception("Chunks processed for another file");
        }

        if ($processingBucket != $bucket) {
            throw new Exception("Processing bucket and processed bucket is different. Expect same buckets");
        }

        $mainBucket = $audioBucket['bucket'];

        $audioBucket->update([
            'manifest_file' => $manifest,
            'bucket' => $processingBucket,
            'segments_of_file' => $processingFile,
            'processing_bucket' => null,
        ]);

        if (!empty($mainBucket)) {
            try {
                $this->fs->deleteDirectory($mainBucket);
            } catch (FilesystemException $e) {
                Log::info("Catch on bucket " . $e->getMessage() . " delete" . $e);
            }
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Transcode\SuccessfullyProcessedRequest;
use App\Services\TranscodeService;
use Illuminate\Http\JsonResponse;
use League\Flysystem\FilesystemException;

class TranscodeController extends Controller
{
    public function __construct(
        private readonly TranscodeService $transcodeService
    )
    {
    }

    public function successfullyProcessed(SuccessfullyProcessedRequest $request): JsonResponse
    {
        $result = $request->validated();

        try {
            $this->transcodeService->successAudioProcessing(
                $result['bucket_id'],
                $result['processing_bucket'],
                $result['manifest_file'],
                $result['audio_file'],
            );
        } catch (\Exception|FilesystemException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json($result);
    }
}

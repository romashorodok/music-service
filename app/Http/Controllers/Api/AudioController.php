<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use Illuminate\Http\JsonResponse;

class AudioController extends Controller
{
    public function __construct(
        private readonly Audio $audio
    )
    {
    }

    public function getAudioById(Audio $audio): JsonResponse
    {
        return response()->json(["audio" => $audio]);
    }

    public function getAudioList(): JsonResponse
    {
        return response()->json($this->audio->newQuery()->get()->all());
    }
}

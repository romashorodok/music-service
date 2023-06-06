<?php

use App\Http\Controllers\Api\AudioController;
use App\Http\Controllers\Api\TranscodeController as TranscodeControllerAlias;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([], function () {
    Route::group([], function () {
        Route::post('transcode', [TranscodeControllerAlias::class, 'successfullyProcessed']);
    });

    Route::group([], function () {
        Route::get('audios/{audio}', [AudioController::class, 'getAudioById']);
        Route::get('audios', [AudioController::class, 'getAudioList']);
    });
});

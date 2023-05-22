<?php

use App\Http\Controllers\Api\AudioController;
use App\Http\Controllers\Api\AuthenticateController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\TranscodeController as TranscodeControllerAlias;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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


Route::group([], function () {
    Route::group([], function () {
        Route::post('transcode', [TranscodeControllerAlias::class, 'successfullyProcessed']);
    });

    Route::middleware('api.token')->get('/user', function (Request $request) {
        return Auth::guard('api')->user();
    });

    Route::group([], function () {
        Route::get('audios/{audio}', [AudioController::class, 'getAudioById']);
        Route::get('audios', [AudioController::class, 'getAudioList']);
    });

    Route::group([], function () {
        Route::post('auth/login', [AuthenticateController::class, "login"]);
        Route::post('auth/register', [AuthenticateController::class, 'register']);

        Route::group(['middleware' => ['api.token']], function () {
            Route::post('auth/logout', [AuthenticateController::class, 'logout']);
        });

        Route::post('auth/refresh', [AuthenticateController::class, 'refresh']);
    });

    Route::group(['middleware' => ['api.token']], function () {
        Route::post('subscription/customer', [SubscriptionController::class, 'createCustomer']);
        Route::post('subscription/plans', [SubscriptionController::class, 'getSubscriptionPlans']);

        Route::post('subscription', [SubscriptionController::class, 'createSubscription']);
    });
});

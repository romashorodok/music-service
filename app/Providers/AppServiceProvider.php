<?php

namespace App\Providers;

use Illuminate\Support\MessageBag;
use App\Observers\AudioObserver;
use App\Services\TranscodeService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(MessageBag::class, function () {
            return new MessageBag();
        });

        $this->app->when(AudioObserver::class)->needs(Filesystem::class)->give(fn() => Storage::disk('minio.segment'));
        $this->app->when(TranscodeService::class)->needs(Filesystem::class)->give(fn () => Storage::disk('minio.segment'));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

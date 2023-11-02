<?php

namespace App\Providers;

use Aws\Credentials\Credentials;
use Aws\S3\S3Client;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter;
use League\Flysystem\Config;
use League\Flysystem\Filesystem;
use League\Flysystem\UrlGeneration\PublicUrlGenerator;

class MinioServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    private function readonlyBucketPolicy($bucket): string
    {
        return json_encode([
            "Version" => "2012-10-17",
            "Statement" => [
                [
                    "Effect" => "Allow",
                    "Principal" => "*",
                    "Action" => "s3:GetObject",
                    "Resource" => "arn:aws:s3:::" . $bucket . "/*"
                ]
            ]
        ]);
    }

    private function initClient($config): Filesystem
    {
        $client = new S3Client([
            'credentials' => new Credentials($config['key'], $config['secret']),
            'region' => $config['region'],
            'endpoint' => $config['endpoint'],
            'version' => 'latest',
            'bucket_endpoint' => false,
            'use_path_style_endpoint' => true,
        ]);

        $bucket = $config['bucket'];

        if (!$client->doesBucketExist($bucket)) {
            $client->createBucket(['Bucket' => $bucket]);
            $client->putBucketPolicy([
                'Bucket' => $bucket,
                'Policy' => $this->readonlyBucketPolicy($bucket)
            ]);
        }

        return new Filesystem(
            adapter: new AwsS3V3Adapter($client, $bucket),

            publicUrlGenerator: new class($config['public']) implements PublicUrlGenerator
            {
                public function __construct(private readonly string $publicPath)
                {
                }

                public function publicUrl(string $path, Config $config): string
                {
                    return $this->publicPath . "/" . $path;
                }
            }
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Storage::extend('minio.image', fn($app, $config) => $this->initClient($config));
        Storage::extend('minio.audio', fn($app, $config) => $this->initClient($config));
        Storage::extend('minio.segment', fn($app, $config) => $this->initClient($config));
    }
}

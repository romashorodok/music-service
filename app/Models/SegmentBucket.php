<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class SegmentBucket extends Model
{
    use CrudTrait;
    use HasFactory;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'segment_buckets';
    // protected $primaryKey = 'id';
    public $timestamps = false;
    protected $guarded = ['id'];
    // protected $fillable = [];
    // protected $hidden = [];
    // protected $dates = [];

    protected string $disk = 'minio.segment';

    /*
    |--------------------------------------------------------------------------
    | FUNCTIONS
    |--------------------------------------------------------------------------
    */
    public function segmentsOf(string $file): bool
    {
        $fileOfSegments = $this->attributes['segments_of_file'] ?? null;

        if ($fileOfSegments != null && $fileOfSegments != '') {
            return $file == $fileOfSegments;
        }

        return false;
    }

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function audio(): BelongsTo
    {
        return $this->belongsTo(Audio::class, 'audio_id', 'id');
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */
    public function getManifestFile($manifestFile): ?string
    {
        $bucket = $this->attributes['bucket'] ?? null;

        if ($bucket == null || $bucket == '') return null;
        if ($manifestFile == null || $manifestFile == '') return null;

        return Storage::disk($this->disk)->publicUrl($bucket . "/" . $manifestFile);
    }

    public function manifestFile(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->getManifestFile($value),
        );
    }

    /*
    |--------------------------------------------------------------------------
    | MUTATORS
    |--------------------------------------------------------------------------
    */
}

<?php

namespace App\Models;

use App\Traits\StorageUploadable;
use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Audio extends Model
{
    use CrudTrait;
    use HasFactory;
    use StorageUploadable;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'audios';
    // protected $primaryKey = 'id';
    public $timestamps = false;
    protected $guarded = ['id'];
    // protected $fillable = [];
    // protected $hidden = [];
    // protected $dates = [];

    private string $disk = 'minio.audio';

    /*
    |--------------------------------------------------------------------------
    | FUNCTIONS
    |--------------------------------------------------------------------------
    */
    public function file(): ?string
    {
        return $this->attributes['original_audio_file'] ?? null;
    }

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'audio_genre');
    }

    public function albums(): BelongsToMany
    {
        return $this->belongsToMany(Album::class, 'audio_album');
    }

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(Image::class, 'audio_image');
    }

    public function segmentBucket(): HasOne
    {
        return $this->hasOne(SegmentBucket::class);
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
    public function originalAudioFile(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value == '' ? null : Storage::disk($this->disk)->publicUrl($value),
            set: fn($value) => $this->upload('original_audio_file', $value)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | MUTATORS
    |--------------------------------------------------------------------------
    */
}

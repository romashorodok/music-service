<?php

namespace App\Models;

use App\Traits\StorageUploadable;
use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    use CrudTrait;
    use HasFactory;
    use StorageUploadable;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'images';
    // protected $primaryKey = 'id';
    public $timestamps = false;
    protected $guarded = ['id'];
    // protected $fillable = [];
    // protected $hidden = [];
    // protected $dates = [];

    private string $disk = 'minio.image';

    /*
    |--------------------------------------------------------------------------
    | FUNCTIONS
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function albums(): BelongsToMany
    {
        return $this->belongsToMany(Album::class, 'album_image');
    }

    public function audios(): BelongsToMany
    {
        return $this->belongsToMany(Audio::class, 'audio_image');
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

    /*
    |--------------------------------------------------------------------------
    | MUTATORS
    |--------------------------------------------------------------------------
    */
    public function originalImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value == '' ? null : Storage::disk($this->disk)->publicUrl($value),
            set: fn($value) => $this->upload('original_image', $value)
        );
    }
}

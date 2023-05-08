<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Audio extends Model
{
    use CrudTrait;
    use HasFactory;

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
    public function uploadOriginalAudioFile($value): string|null
    {
        $disk = 'public';

        if ($value == '') {
            $audioFile = $this->attributes['original_audio_file'];

            if ($audioFile != '') {
                $exists = Storage::disk($disk)->exists($audioFile);

                if ($exists) {
                    Storage::disk($disk)->delete($audioFile);
                }
            }

            return null;
        } else {
            return Storage::disk($disk)->putFile('', $value);
        }
    }

    public function originalAudioFile(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value == '' ? null : Storage::url($value),
            set: fn($value) => $this->uploadOriginalAudioFile($value)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | MUTATORS
    |--------------------------------------------------------------------------
    */
}

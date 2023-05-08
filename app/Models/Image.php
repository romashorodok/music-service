<?php

namespace App\Models;

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
    public function setImage($value): string|null
    {
        $disk = 'public';

        if ($value == '') {
            $imageFile = $this->attributes['original_image'];

            if ($imageFile != '') {
                $exists = Storage::disk($disk)->exists($imageFile);

                if ($exists) {
                    Storage::disk($disk)->delete($imageFile);
                }
            }

            return null;
        } else {
            return Storage::disk($disk)->putFile('', $value);
        }
    }

    public function originalImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value == '' ? null : Storage::url($value),
            set: fn($value) => $this->setImage($value)
        );
    }
}

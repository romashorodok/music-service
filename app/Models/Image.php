<?php

namespace App\Models;

use App\Traits\StorageUploadable;
use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\FilesystemException;

class Image extends Model
{
    use CrudTrait;
    use HasFactory;
    use StorageUploadable;

    protected $table = 'images';

    public $timestamps = false;

    protected $guarded = ['id'];

    private string $disk = 'minio.image';

    public function albums(): BelongsToMany
    {
        return $this->belongsToMany(Album::class, 'album_image');
    }

    public function audios(): BelongsToMany
    {
        return $this->belongsToMany(Audio::class, 'audio_image');
    }

    /**
     * @throws FilesystemException
     */
    public function getOriginalImageAttribute(?string $value): ?string
    {
        return !empty($value)
            ? Storage::disk($this->disk)->publicUrl($value)
            : null;
    }

    /**
     * @throws FilesystemException
     */
    public function setOriginalImageAttribute(?UploadedFile $source): void
    {
        $this->attributes['original_image'] = $this->upload('original_image', $source);
    }
}

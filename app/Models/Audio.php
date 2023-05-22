<?php

namespace App\Models;

use App\Traits\StorageUploadable;
use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\FilesystemException;

class Audio extends Model
{
    use CrudTrait;
    use HasFactory;
    use StorageUploadable;

    protected $table = 'audios';

    public $timestamps = false;

    protected $guarded = ['id'];

    private string $disk = 'minio.audio';

    public function file(): ?string
    {
        return $this->attributes['original_audio_file'] ?? null;
    }

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

    /**
     * @throws FilesystemException
     */
    public function setOriginalAudioFileAttribute(?UploadedFile $source): void
    {
        $this->attributes['original_audio_file'] = $this->upload('original_audio_file', $source);
    }

    public function getOriginalAudioFileAttribute(?string $value): ?string
    {
        return empty($value)
            ? null
            : Storage::disk($this->disk)->publicUrl($value);
    }
}

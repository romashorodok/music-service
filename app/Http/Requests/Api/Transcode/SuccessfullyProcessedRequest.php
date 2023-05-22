<?php

namespace App\Http\Requests\Api\Transcode;

use Illuminate\Foundation\Http\FormRequest;

class SuccessfullyProcessedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'bucket_id' => 'required|integer',
            'audio_file' => 'required',
            'manifest_file' => 'required',
            'processing_bucket' => 'required',
        ];
    }
}

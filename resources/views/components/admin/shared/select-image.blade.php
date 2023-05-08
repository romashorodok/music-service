{{-- select multiple --}}
@php
    if (!isset($field['options'])) {
        $options = $field['model']::all();
    } else {
        $options = call_user_func($field['options'], $field['model']::query());
    }
    $field['allows_null'] = $field['allows_null'] ?? true;

    $field['value'] = old_empty_or_null($field['name'], collect()) ??  $field['value'] ?? $field['default'] ?? collect();

    if (is_a($field['value'], \Illuminate\Support\Collection::class)) {
        $field['value'] = $field['value']->pluck(app($field['model'])->getKeyName())->toArray();
    }
@endphp
<label>{!! $field['label'] !!}</label>

<input type="hidden" name="{{ $field['name'] }}" value=""
       @if(in_array('disabled', $field['attributes'] ?? [])) disabled @endif />

<div class="select-with-images">
    <div class="image-preview">
        <img src="{{ $entry?->images[0]->original_image }}" alt=""/>
    </div>

    <button type="button" class="btn btn-secondary btn-select-image">
        Select Image
    </button>

    <div class="image-grid" style="display: none;">
        <div class="image-grid-wrapper">
            @if (count($options))
                @foreach ($options as $option)
                    @php
                        $image = $option->{$field['attribute']};
                        $isSelected = in_array($option->getKey(), (array)$field['value']);
                    @endphp

                    <label class="image-option">
                        <input type="radio" name="{{ $field['name'] }}[]" value="{{ $option->getKey() }}"
                               @if($isSelected) checked @endif>

                        <img src="{{ $image }}" alt="">
                    </label>
                @endforeach
            @endif
        </div>
    </div>
</div>

<style>
    .select-with-images .image-grid {
        position: absolute;
        z-index: 100;
        display: none;
        background-color: #fff;
        border: 1px solid #ccc;
        max-height: 300px;
        overflow-y: auto;
    }

    .select-with-images .image-option {
        padding: 5px;
        cursor: pointer;
    }

    .image-grid-wrapper {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding: 15px;
    }

    .image-preview {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }

    .image-option img {
        width: 100px;
        height: 100px;
    }

    .image-preview img {
        width: 300px;
        height: 300px;
    }
</style>

<script type="module">
    $(document).ready(function () {

        $('.btn-select-image').click(function () {
            $('.image-grid').toggle();
        });

        $('.image-option input[type="radio"]').change(function () {
            const selectedImage = $('.image-option input[type="radio"]:checked').val();
            $('input[name="{{ $field['name'] }}[]"]').val(selectedImage);

            if (selectedImage) {
                const selectedImageUrl = $('.image-option input[type="radio"]:checked').siblings('img').attr('src');
                $('.image-preview img').attr('src', selectedImageUrl);
            }
        });

        $(document).click(function (event) {
            if (!$(event.target).closest('.image-grid').length && !$(event.target).closest('.btn-select-image').length) {
                $('.image-grid').hide();
            }
        });
    });
</script>

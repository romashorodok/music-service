<div>
    @foreach($entry->images as $image)
        <img class="my-2" src="{{ $image->original_image }}" width="390px" height="390px"/>
    @endforeach
</div>

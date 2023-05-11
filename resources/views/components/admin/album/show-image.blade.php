<div>
    @foreach($entry->images as $image)
        <img class="my-2" src="{{ $image->original_image }}" width="150px" height="150px"/>
    @endforeach
</div>

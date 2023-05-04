{{-- This file is used to store sidebar items, inside the Backpack admin panel --}}
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('dashboard') }}"><i class="la la-home nav-icon"></i> {{ trans('backpack::base.dashboard') }}</a></li>

<li class="nav-item"><a class="nav-link" href="{{ backpack_url('image') }}"><i class="nav-icon la la-question"></i> Images</a></li>
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('bucket') }}"><i class="nav-icon la la-question"></i> Buckets</a></li>
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('album') }}"><i class="nav-icon la la-question"></i> Albums</a></li>
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('audio') }}"><i class="nav-icon la la-question"></i> Audio</a></li>
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('genre') }}"><i class="nav-icon la la-question"></i> Genres</a></li>
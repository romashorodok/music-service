<?php

return [
    'key'    => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),

    'products' => [
        'extended'  => [
            'product' => env('STRIPE_EXTENDED_PRODUCT'),
        ],
        'unlimited' => [
            'product' => env('STRIPE_UNLIMITED_PRODUCT'),
        ],
    ]
];

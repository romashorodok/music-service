<?php

return [
    'key'    => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),

    'products' => [
        'extended'  => [
            'product' => env('STRIPE_EXTENDED_PRODUCT'),
            'price'   => 'price_1N6WIzAgTou10Ln8kvK1s1R2',
        ],
        'unlimited' => [
            'product' => env('STRIPE_UNLIMITED_PRODUCT'),
            'price'   => 'price_1N6WKWAgTou10Ln8ZWxPXZ2g',
        ],
    ]
];

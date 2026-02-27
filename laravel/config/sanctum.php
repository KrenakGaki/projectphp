<?php

use Laravel\Sanctum\Sanctum;

return [
    'expiration' => 20,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),
];

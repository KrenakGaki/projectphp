<?php

namespace App\Exceptions;

use Exception;

class ProductNotFoundException extends Exception
{
    public function __construct($message = "Produto não encontrado.") {
        parent::__construct($message);
    }
}

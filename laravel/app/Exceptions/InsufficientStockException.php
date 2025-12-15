<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    public function __construct($message = "Estoque insuficiente.") {
        parent::__construct($message);
    }
}
    
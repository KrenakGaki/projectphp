<?php

namespace App\Exceptions;

use Exception;

class SaleNotFoundException extends Exception
{
    public function __construct($message = "Venda não encontrada.") {
        parent::__construct($message);
    }
}

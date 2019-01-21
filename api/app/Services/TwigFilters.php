<?php

namespace App\Services;

//wire these up in twigbridge.php
class TwigFilters
{
    static function formatMoney($amount)
    {
        return number_format($amount/100, 2, ".", "'");
    }

    static function formatVat($amount)
    {
        return number_format($amount*100, 1, ".", "'") . " %";
    }
}

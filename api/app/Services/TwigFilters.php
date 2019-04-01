<?php

namespace App\Services;

//wire these up in twigbridge.php
class TwigFilters
{
    static function formatChf($amount)
    {
        return \number_format(round(($amount / 100 + 0.000001) * 20) / 20, 2, '.', "'");
    }

    static function formatMoney($amount)
    {
        return number_format($amount/100, 2, ".", "'");
    }

    static function formatVat($amount)
    {
        return number_format($amount*100, 1, ".", "'") . " %";
    }
}

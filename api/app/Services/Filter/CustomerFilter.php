<?php

namespace App\Services\Filter;

use App\Models\Customer\Customer;

class CustomerFilter
{
    public static function fetch(array $filters = [])
    {
        $queryBuilder = Customer::orderBy('id');

        if (!empty($filters['customer_tags'])) {
            $queryBuilder = $queryBuilder->whereHas('customer_tags', function ($ct) use ($filters) {
                $ct->whereIn('id', explode(',', $filters['customer_tags']));
            });
        }

        // the value "0" equals to false in PHP, so empty will always return false even 0 is valid value
        if (array_key_exists('include_hidden', $filters) && $filters['include_hidden'] == 0) {
            $queryBuilder = $queryBuilder->where('hidden', '=', false);
        }

        return $queryBuilder->get();
    }
}

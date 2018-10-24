<?php

namespace App\Services;

use Illuminate\Support\Collection;

class CostBreakdown
{
    public static function calculate($breakdownable)
    {
        /** @var Collection $positions */
        $positions = $breakdownable->positions;

        // calculate subtotal without VAT
        $subtotal = intval($positions->map(function ($position) {
            return $position->calculatedTotal();
        })->sum());

        // calculate discounts
        $discounts = collect([]);
        foreach ($breakdownable->discounts as $discount) {
            $discounts[] = self::applyDiscount($subtotal, $discount);
        }
        $discountsTotal = intval($discounts->sum('value'));

        // calculate VATs
        $totalWithDiscounts = $subtotal - $discountsTotal;
        $vats = self::vats($positions, $totalWithDiscounts);
        $vatTotal = intval($vats->sum('value'));

        // calculate totals
        $total = intval($totalWithDiscounts + $vatTotal);

        return [
            'discounts' => $discounts,
            'discountTotal' => $discountsTotal,
            'rawTotal' => $totalWithDiscounts,
            'subtotal' => $subtotal,
            'total' => $total,
            'vats' => $vats,
            'vatTotal' => $vatTotal
        ];
    }

    /**
     * Passes the call to either applyDiscountFactor or applyDiscountFixed, depending on the percentage property
     *
     * @param float $subtotal
     * @param $discount
     * @return array
     */
    private static function applyDiscount(float $subtotal, $discount)
    {
        if ($discount->percentage) {
            return self::applyDiscountFactor($subtotal, $discount);
        } else {
            return self::applyDiscountFixed($discount);
        }
    }

    /**
     * Returns an array with the name and the value of the given percentage discount
     *
     * @param float $subtotal
     * @param $discount
     * @return array
     */
    private static function applyDiscountFactor(float $subtotal, $discount)
    {
        return [
            'name' => $discount->name . ' (' . $discount->value . ')',
            'value' => intval($subtotal * $discount->value)
        ];
    }

    /**
     * Returns an array with the name and the value of the given fixed discount
     *
     * @param $discount
     * @return array
     */
    private static function applyDiscountFixed($discount)
    {
        return [
            'name' => $discount->name,
            'value' => intval($discount->value)
        ];
    }

    /**
     * Takes a collection of Positions (either Offer or Invoice) and sorts them by their VAT
     *
     * @param Collection $positions
     * @return array
     */
    private static function groupByVat(Collection $positions)
    {
        $vatGroups = [];

        foreach ($positions as $position) {
            $vat = (string)$position->vat;
            if (!array_key_exists($vat, $vatGroups)) {
                $vatGroups[$vat] = [];
            }

            $vatGroups[$vat][] = $position;
        };

        return $vatGroups;
    }

    private static function vatDistribution($positions)
    {
        $sums = [];
        $total = 0;
        $vatGroups = self::groupByVat($positions);

        foreach ($vatGroups as $vat => $positions) {
            $sum = 0;

            foreach ($positions as $position) {
                $sum += $position->calculatedTotal();
            }

            $sums[$vat] = $sum;
            $total += $sum;
        }

        $distributions = [];
        foreach ($sums as $vat => $sum) {
            $distributions[$vat] = $sum / $total;
        }

        return $distributions;
    }

    /**
     * Returns the different vats
     *
     * @return array
     */
    private static function vats($positions, $totalWithDiscount)
    {
        $vatValues = collect([]);
        $vatDistribution = self::vatDistribution($positions);

        foreach ($vatDistribution as $vat => $factor) {
            $vatValues[] = [
                'factor' => $factor,
                'vat' => $vat,
                'value' => intval($totalWithDiscount * floatval($vat) * $factor)
            ];
        }

        return $vatValues;
    }
}

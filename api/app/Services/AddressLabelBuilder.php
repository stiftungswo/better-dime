<?php

namespace App\Services;

class AddressLabelBuilder
{
    /**
     * @param \App\Models\Offer\Offer|\App\Models\Invoice\Invoice $document
     * @return string
     */
    public static function build($document, $esr = false)
    {
        $baseArray = [];

        if ($document->customer->company) {
            $baseArray[] = str_replace(" ", "&#160;", $document->customer->company->name);
        } elseif ($document->customer->name) {
            $baseArray[] = $document->customer->name;
        }

        if ($document->customer->department) {
            $baseArray[] = $document->customer->department;
        }

        if ($document->customer->first_name) {
            if ($document->customer->salutation) {
                $baseArray[] = "{$document->customer->salutation} {$document->customer->first_name} {$document->customer->last_name}";
            } else {
                $baseArray[] = "{$document->customer->first_name} {$document->customer->last_name}";
            }
        }

        $baseArray[] = $document->address->street;
        !$document->address->supplement ?: array_push($baseArray, $document->address->supplement);
        $baseArray[] = $document->address->postcode . ' ' . $document->address->city;
        !$document->address->country || $esr ?: array_push($baseArray, $document->address->country);

        return implode('<br>', $baseArray);
    }
}

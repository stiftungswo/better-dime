<?php

namespace App\Services\Export;

use App\Services\Filter\RevenuePosition;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

/*
 * Input: an array of RevenuePosition:
 *
 *     {
        "source": "project",
        "name": "et sit ut",
        "category": "omnis",
        "customer": "Rohner Mettler AG",
        "created": [php date],
        "accountant": "Nils Schmidt",
        "offer_price": 18449746,
        "project_price": 46044711.911999986,
        "invoice_price": 46044691.36,
        "costgroup_values": {
            "rerum (9227) ": -2025967324.1279993,
            "quidem (781) ": -828804814.4159997,
            "sequi (831) ": 1381341357.3599997,
            "velit (4848) ": 1473430781.1839995
        }
    },

 */

function formatAmount($value)
{
    return round($value/100);
}

class RevenueReport implements FromArray, ShouldAutoSize
{
    private $positions;
    private $costgroups;

    public function __construct(Collection $positions)
    {
        $this->positions = $positions->sortBy(function ($position) {
            return [$position->source, $position->name];
        });

        $this->costgroups = $positions->flatMap(function ($pos) {
            return collect($pos->costgroup_values)->keys();
        })->unique()->values()->toArray();

        sort($this->costgroups);
    }

    public function array(): array
    {
        $baseHeaders = ['Typ', 'Name', 'Kategorie (Tätigkeitsbereich)', 'Auftraggeber', 'Start',
            'Verantwortlicher Mitarbeiter', 'Aufwand CHF (Projekt)',
            'Umsatz CHF (Rechnung)', 'Umsatz erwartet CHF (Offerte)'];

        $headers = array_merge($baseHeaders, $this->costgroups);

        $rows = [$headers];

        /** @var RevenuePosition $position */
        foreach ($this->positions as $position) {
            $row = [];
            $row[] = $position->source;
            $row[] = $position->name;
            $row[] = $position->category;
            $row[] = $position->customer;
            $row[] = $position->created->format('d.m.Y');
            $row[] = $position->accountant;
            $row[] = formatAmount($position->project_price);
            $row[] = formatAmount($position->invoice_price);
            $row[] = formatAmount($position->offer_price);

            foreach ($this->costgroups as $costgroup) {
                if (array_key_exists($costgroup, $position->costgroup_values)) {
                    $row[] = formatAmount($position->costgroup_values[$costgroup]);
                } else {
                    $row[] = null;
                }
            }

            $rows[] = $row;
        }
        return $rows;
    }
}

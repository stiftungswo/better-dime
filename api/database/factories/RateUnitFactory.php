<?php

use App\Models\Service\RateUnit;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(RateUnit::class, function (Generator $faker) {
    $unit = $faker->lexify("??");
    return [
        'billing_unit' => "CHF / $unit",
        'effort_unit' => $unit,
        'factor' => $faker->optional(0.5, 1)->numberBetween(1, 1000),
        'archived' => $faker->randomElement([true, false, false, false, false]),
    ];
});

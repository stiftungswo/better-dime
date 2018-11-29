<?php

use App\Models\Service\RateUnit;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(RateUnit::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $unit = $faker->lexify("??");
    $isTime = $faker->boolean;

    return [
        'billing_unit' => "CHF / $unit",
        'effort_unit' => $unit,
        'factor' => $isTime ? $faker->numberBetween(1, 100) : 1,
        'is_time' => $isTime,
        'name' => $faker->word,
        'archived' => $faker->boolean(20),
    ];
});

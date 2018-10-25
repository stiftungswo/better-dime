<?php

use Faker\Generator;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Offer\OfferPosition::class, function (Generator $faker) {
    return [
        'amount' => $faker->numberBetween(1, 40),
        'price_per_rate' => $faker->numberBetween(3000, 18000),
        'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create()->id,
        'service_id' => factory(\App\Models\Service\Service::class)->create()->id,
        'vat' => $faker->randomFloat(3, 0.025, 0.077)
    ];
});

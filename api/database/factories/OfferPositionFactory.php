<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Offer\OfferPosition::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'amount' => $faker->numberBetween(1, 40),
        'price_per_rate' => $faker->numberBetween(3000, 18000),
        'vat' => $faker->randomElement([0.025, 0.077]),
    ];
});

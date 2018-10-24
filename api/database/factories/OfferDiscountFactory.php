<?php

use Faker\Generator;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Offer\OfferDiscount::class, function (Generator $faker) {
    $percentage = $faker->boolean;

    return [
        'name' => $faker->word . ' Rabatt',
        'offer_id' => factory(\App\Models\Offer\Offer::class),
        'percentage' => $percentage,
        'value' => $percentage ? $faker->randomFloat(2) : $faker->numberBetween(50000, 100000)
    ];
});

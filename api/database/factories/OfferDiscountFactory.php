<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Offer\OfferDiscount::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $percentage = $faker->boolean;

    return [
        'name' => $faker->word . ' Rabatt',
        'offer_id' => function () {
            return factory(\App\Models\Offer\Offer::class)->create()->id;
        },
        'percentage' => $percentage,
        'value' => $percentage ? $faker->randomFloat(2, 0.01, 0.25) : $faker->numberBetween(50000, 100000)
    ];
});

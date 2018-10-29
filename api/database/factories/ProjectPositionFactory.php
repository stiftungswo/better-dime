<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Project\ProjectPosition::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'description' => $faker->sentence,
        'price_per_rate' => $faker->numberBetween(3000, 18000),
        'vat' => $faker->randomFloat(3, 0.025, 0.077)
    ];
});

<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Project\Project::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $hasFixedPrice = $faker->boolean;
    $price = $faker->numberBetween(100000, 1000000);

    return [
        'archived' => $faker->boolean,
        'budget_price' => $hasFixedPrice ? $price : rand(1, 10) == 5 ? $faker->numberBetween(100000, 1000000) : null,
        'budget_time' => $faker->numberBetween(100, 500),
        'chargeable' => $faker->boolean,
        'deadline' => $faker->dateTimeBetween('+30 days', '+270 days'),
        'description' => $faker->sentence,
        'fixed_price' => $hasFixedPrice ? $price : null,
        'name' => $faker->sentence,
        'started_at' => $faker->dateTimeBetween('-270 days', '-90 days'),
        'stopped_at' => $faker->dateTimeBetween('+30 days', '+270 days'),
    ];
});

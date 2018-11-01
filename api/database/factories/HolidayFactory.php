<?php

use App\Models\Employee\Holiday;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(Holiday::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'name' => $faker->word,
        'date' => $faker->dateTimeBetween('-2 years'),
        'duration' => $faker->numberBetween(60, 504),
    ];
});

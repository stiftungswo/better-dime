<?php

use App\Models\Employee\Holiday;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(Holiday::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->word,
        'date' => $faker->date(),
        'duration' => $faker->numberBetween(60, 504),
    ];
});

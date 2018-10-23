<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Customer\Phone::class, function (Faker\Generator $faker) {
    return [
        'category' => $faker->numberBetween(1, 5),
        'number' => $faker->phoneNumber
    ];
});

<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Customer\Phone::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'category' => $faker->numberBetween(1, 5),
        'number' => $faker->phoneNumber
    ];
});

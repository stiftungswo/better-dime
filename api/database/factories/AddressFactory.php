<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Customer\Address::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'city' => $faker->city,
        'country' => $faker->country,
        'description' => $faker->sentence,
        'postcode' => $faker->postcode,
        'street' => $faker->streetName,
        'supplement' => rand(1, 10) == '5' ? $faker->streetSuffix : null
    ];
});
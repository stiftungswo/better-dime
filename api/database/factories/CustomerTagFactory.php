<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Customer\CustomerTag::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->word
    ];
});

<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Invoice\Costgroup::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'name' => $faker->word,
        'number' => $faker->unique()->numberBetween(100, 999)
    ];
});

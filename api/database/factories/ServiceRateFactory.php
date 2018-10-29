<?php

use App\Models\Service\ServiceRate;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(ServiceRate::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'value' => $faker->numberBetween(0, 1000),
    ];
});

<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Invoice\CostgroupDistribution::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'weight' => $faker->numberBetween(20, 100),
    ];
});

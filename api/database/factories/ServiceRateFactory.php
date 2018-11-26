<?php

use App\Models\Service\ServiceRate;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(ServiceRate::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'rate_group_id' => function () {
            return factory(\App\Models\Service\RateGroup::class)->create()->id;
        },
        'rate_unit_id' => function () {
            return factory(\App\Models\Service\RateUnit::class)->create()->id;
        },
        'service_id' => function () {
            return factory(\App\Models\Service\Service::class)->create()->id;
        },
        'value' => $faker->numberBetween(0, 1000),
    ];
});

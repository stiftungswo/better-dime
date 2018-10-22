<?php

use App\Models\Service\RateGroup;
use App\Models\Service\Service;
use App\Models\Service\ServiceRate;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(ServiceRate::class, function (Generator $faker) {
    return [
        'rate_group_id' => factory(RateGroup::class),
        'service_id' => factory(Service::class),
        'value' => $faker->numberBetween(0, 1000),
    ];
});

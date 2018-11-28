<?php

/** @var Factory $factory */

use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Project\ProjectPosition::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'description' => $faker->optional()->sentence,
        'price_per_rate' => $faker->numberBetween(3000, 18000),
        'project_id' => function () {
            return factory(\App\Models\Project\Project::class)->create()->id;
        },
        'rate_unit_id' => function () {
            return factory(\App\Models\Service\RateUnit::class)->create()->id;
        },
        'service_id' => function () {
            return factory(\App\Models\Service\Service::class)->create()->id;
        },
        'vat' => $faker->randomElement([0.025, 0.077]),
    ];
});

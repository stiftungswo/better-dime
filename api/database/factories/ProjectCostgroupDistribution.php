<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Project\ProjectCostgroupDistribution::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'costgroup_number' => function () {
            return factory(\App\Models\Costgroup\Costgroup::class)->create()->weight;
        },
        'project_id' => function () {
            return factory(\App\Models\Project\Project::class)->create()->id;
        },
        'weight' => $faker->numberBetween(20, 100),
    ];
});

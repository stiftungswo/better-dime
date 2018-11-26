<?php

/** @var Factory $factory */

use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Project\ProjectComment::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'comment' => $faker->sentence,
        'date' => $faker->dateTimeBetween('-2 years'),
        'project_id' => function () {
            return factory(\App\Models\Project\Project::class)->create()->id;
        },
    ];
});

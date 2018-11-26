<?php

/** @var Factory $factory */

use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Project\ProjectEffort::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'date' => $faker->dateTimeBetween('-2 years'),
        'employee_id' => function () {
            return factory(\App\Models\Employee\Employee::class)->create()->id;
        },
        'value' => $faker->randomFloat(3, 1, 50),
        'position_id' => function () {
            return factory(\App\Models\Project\ProjectPosition::class)->create()->id;
        }
    ];
});

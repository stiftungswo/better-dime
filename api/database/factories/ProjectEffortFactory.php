<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Project\ProjectEffort::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'date' => $faker->dateTimeBetween('-270 days', '-90 days'),
        'value' => $faker->randomFloat(3, 1, 50)
    ];
});

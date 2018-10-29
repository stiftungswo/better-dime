<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Project\ProjectComment::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'comment' => $faker->sentence,
        'date' => $faker->dateTimeBetween('-270 days', '-90 days'),
    ];
});

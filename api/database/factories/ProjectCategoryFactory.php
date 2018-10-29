<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Project\ProjectCategory::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'name' => $faker->word
    ];
});

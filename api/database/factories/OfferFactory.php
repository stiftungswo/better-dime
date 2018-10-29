<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Offer\Offer::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $faker->addProvider(new \DavidBadura\FakerMarkdownGenerator\FakerProvider($faker));

    return [
        'description' => $faker->markdown(),
        'name' => $faker->words(3, true),
        'short_description' => $faker->sentence,
        'status' => $faker->numberBetween(1, 3)
    ];
});

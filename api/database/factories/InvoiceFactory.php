<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Invoice\Invoice::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $faker->addProvider(new \DavidBadura\FakerMarkdownGenerator\FakerProvider($faker));

    return [
        'description' => $faker->markdown(),
        'end' => $faker->dateTimeBetween('-12 months'),
        'fixed_price' => $faker->numberBetween(150000, 1000000),
        'name' => $faker->words(3, true),
        'start' => $faker->dateTimeBetween('-24 months', '-1 year'),
    ];
});

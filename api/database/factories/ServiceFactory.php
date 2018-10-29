<?php

use App\Models\Service\Service;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(Service::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'name' => $faker->words(3, true),
        'description' => $faker->sentence,
        'vat' => $faker->randomElement([0.025, 0.077]),
        'chargeable' => $faker->randomElement([true, false]),
        'archived' => $faker->randomElement([true, false, false, false, false]),
    ];
});

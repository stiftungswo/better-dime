<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Customer\Company::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'comment' => $faker->sentence,
        'chargeable' => $faker->boolean,
        'email' => $faker->companyEmail,
        'hidden' => $faker->boolean,
        'name' => $faker->company,
    ];
});

<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Customer\Person::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'comment' => $faker->sentence,
        'email' => $faker->companyEmail,
        'first_name' => $faker->firstName,
        'hidden' => $faker->boolean,
        'last_name' => $faker->lastName,
        'salutation' => $faker->title
    ];
});

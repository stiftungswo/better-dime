<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Customer\Person::class, function (Faker\Generator $faker) {
    return [
        'comment' => $faker->sentence,
        'chargeable' => $faker->boolean,
        'email' => $faker->companyEmail,
        'first_name' => $faker->firstName,
        'hidden' => $faker->boolean,
        'last_name' => $faker->lastName,
        'rate_group_id' => factory(\App\Models\Service\RateGroup::class),
        'salutation' => $faker->title
    ];
});

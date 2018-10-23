<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Customer\Company::class, function (Faker\Generator $faker) {
    return [
        'comment' => $faker->sentence,
        'chargeable' => $faker->boolean,
        'email' => $faker->companyEmail,
        'hidden' => $faker->boolean,
        'name' => $faker->company,
        'rate_group_id' => factory(\App\Models\Service\RateGroup::class)
    ];
});

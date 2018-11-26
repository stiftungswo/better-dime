<?php

/** @var Factory $factory */

use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Customer\Company::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'comment' => $faker->sentence,
        'email' => $faker->companyEmail,
        'hidden' => $faker->boolean,
        'name' => $faker->company,
        'rate_group_id' => function () {
            return factory(\App\Models\Service\RateGroup::class)->create()->id;
        }
    ];
});

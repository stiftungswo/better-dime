<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Customer\Phone::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $type = rand(1, 10) > 5 ? \App\Models\Customer\Company::class : \App\Models\Customer\Person::class;

    return [
        'category' => $faker->numberBetween(1, 5),
        'customer_id' => function () use ($type) {
            return factory($type)->create()->id;
        },
        'customer_type' => $type,
        'number' => $faker->phoneNumber
    ];
});

<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Offer\Offer::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $faker->addProvider(new \DavidBadura\FakerMarkdownGenerator\FakerProvider($faker));

    return [
        'accountant_id' => function () {
            return factory(\App\Models\Employee\Employee::class)->create()->id;
        },
        'address_id' => function () {
            return factory(\App\Models\Customer\Address::class)->create()->id;
        },
        'description' => $faker->markdown(),
        'name' => $faker->words(3, true),
        'rate_group_id' => function () {
            return factory(\App\Models\Service\RateGroup::class)->create()->id;
        },
        'short_description' => $faker->sentence,
        'status' => $faker->numberBetween(1, 3)
    ];
});

<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Project\Project::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $hasFixedPrice = $faker->boolean;
    $price = $faker->numberBetween(100000, 1000000);

    return [
        'accountant_id' => function () {
            return factory(\App\Models\Employee\Employee::class)->create()->id;
        },
        'address_id' => function () {
            return factory(\App\Models\Customer\Address::class)->create()->id;
        },
        'archived' => $faker->boolean,
        'category_id' => function () {
            return factory(\App\Models\Project\ProjectCategory::class)->create()->id;
        },
        'chargeable' => $faker->boolean,
        'deadline' => $faker->dateTimeBetween('+30 days', '+270 days'),
        'description' => $faker->sentence,
        'fixed_price' => $hasFixedPrice ? $price : null,
        'name' => $faker->sentence,
        'offer_id' => function () {
            return factory(\App\Models\Offer\Offer::class)->create()->id;
        },
        'rate_group_id' => function () {
            return factory(\App\Models\Service\RateGroup::class)->create()->id;
        },
        'vacation_project' => false,
    ];
});

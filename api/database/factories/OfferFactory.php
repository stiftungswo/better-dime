<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Offer\Offer::class, function (Faker\Generator $faker) {
    $customer = factory(\App\Models\Customer\Person::class)->create();

    return [
        'accountant_id' => factory(\App\Models\Employee\Employee::class)->create()->id,
        'address_id' => factory(\App\Models\Customer\Address::class)->create()->id,
        'customer_id' => $customer->id,
        'customer_type' => \App\Models\Customer\Person::class,
        'description' => $faker->sentence,
        'name' => $faker->words(3, true),
        'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
        'short_description' => $faker->sentence,
        'status' => $faker->numberBetween(1, 3)
    ];
});

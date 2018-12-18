<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Invoice\InvoiceCostgroupDistribution::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'costgroup_number' => function () {
            return factory(\App\Models\Costgroup\Costgroup::class)->create()->weight;
        },
        'invoice_id' => function () {
            return factory(\App\Models\Invoice\Invoice::class)->create()->id;
        },
        'weight' => $faker->numberBetween(20, 100),
    ];
});
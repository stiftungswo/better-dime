<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Invoice\InvoiceDiscount::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $percentage = $faker->boolean;

    return [
        'invoice_id' => function () {
            return factory(\App\Models\Invoice\Invoice::class)->create()->id;
        },
        'name' => $faker->word . ' Rabatt',
        'percentage' => $percentage,
        'value' => $percentage ? $faker->randomFloat(2, 0, 50) : $faker->numberBetween(50000, 100000)
    ];
});

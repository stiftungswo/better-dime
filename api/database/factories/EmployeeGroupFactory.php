<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Employee\EmployeeGroup::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'name' => $faker->word,
    ];
});

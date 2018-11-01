<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Employee\WorkPeriod::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'employee_id' => factory(\App\Models\Employee\Employee::class)->create()->id,
        'end' => $faker->dateTimeBetween('-1 years'),
        'pensum' => $faker->numberBetween(70, 100),
        'start' => $faker->dateTimeBetween('-2 years', '-1 years'),
        'vacation_takeover' => $faker->numberBetween(0, 5040),
        'yearly_vacation_budget' => $faker->numberBetween(168, 210),
    ];
});

<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Invoice\Invoice::class, function () {
    $faker = Faker\Factory::create('de_CH');
    $faker->addProvider(new \DavidBadura\FakerMarkdownGenerator\FakerProvider($faker));

    return [
        'accountant_id' => function () {
            return factory(\App\Models\Employee\Employee::class)->create()->id;
        },
        'address_id' => function () {
            return factory(\App\Models\Customer\Address::class)->create()->id;
        },
        'customer_id' => function () {
            return factory(rand(0, 1) == 1 ? \App\Models\Customer\Person::class : \App\Models\Customer\Company::class)->create()->id;
        },
        'description' => $faker->markdown(),
        'end' => $faker->dateTimeBetween('-12 months'),
        'fixed_price' => $faker->numberBetween(150000, 1000000),
        'project_id' => function () {
            return factory(\App\Models\Project\Project::class)->create()->id;
        },
        'name' => $faker->words(3, true),
        'start' => $faker->dateTimeBetween('-24 months', '-1 year'),
    ];
});

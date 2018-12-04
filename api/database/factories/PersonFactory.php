<?php

/** @var Factory $factory */
use Illuminate\Database\Eloquent\Factory;

$factory->define(\App\Models\Customer\Person::class, function () {
    $faker = Faker\Factory::create('de_CH');

    return [
        'comment' => $faker->sentence,
        'company_id' => function () {
            $val = rand(0, 1) == 1 ? factory(\App\Models\Customer\Company::class)->create()->id : null;
            return $val;
        },
        'department' => $faker->word,
        'email' => $faker->companyEmail,
        'first_name' => $faker->firstName,
        'hidden' => $faker->boolean,
        'last_name' => $faker->lastName,
        'rate_group_id' => function () {
            return factory(\App\Models\Service\RateGroup::class)->create()->id;
        },
        'salutation' => $faker->title
    ];
});

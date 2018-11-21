<?php

use App\Models\Employee\Employee;
use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(Employee::class, function () {
    $faker = Faker\Factory::create('de_CH');

    $firstName = $faker->firstName;
    $lastName = $faker->lastName;
    $email = str_slug(strtolower($firstName) . strtolower($lastName) . rand(100, 999)) . '@example.org';

    return [
        'can_login' => $faker->boolean,
        'email' => $email,
        'first_name' => $firstName,
        'holidays_per_year' => $faker->numberBetween(20, 25),
        'last_name' => $lastName,
        'password' => $faker->password,
        'is_admin' => false
    ];
});

$factory->defineAs(Employee::class, 'admin', function () use ($factory) {
    $user = $factory->raw(Employee::class);
    $user['can_login'] = true;
    $user['email'] ='office@stiftungswo.ch';
    $user['password'] = 'Welcome01';
    $user['is_admin'] = true;
    $user['first_name'] = 'Ers';
    $user['last_name'] = 'Gutermann';
    return $user;
});

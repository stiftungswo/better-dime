<?php

use App\Models\Employee\Employee;
use Illuminate\Database\Eloquent\Factory;
use Illuminate\Support\Str;

/** @var Factory $factory */
$factory->define(Employee::class, function () {
    $faker = Faker\Factory::create('de_CH');

    $firstName = $faker->firstName;
    $lastName = $faker->lastName;
    $asciiFirstName = Str::ascii($firstName, 'de_CH');
    $asciiLastName = Str::ascii($lastName, 'de_CH');
    $email = str_slug(strtolower($asciiFirstName) . strtolower($asciiLastName) . rand(100, 999)) . '@example.org';

    return [
        'can_login' => $faker->boolean,
        'email' => $email,
        'first_name' => $firstName,
        'holidays_per_year' => $faker->numberBetween(20, 25),
        'last_name' => $lastName,
        'encrypted_password' => $faker->password,
        'is_admin' => false,
        'first_vacation_takeover' => 0,
        'employee_group_id' => function () {
            return factory(\App\Models\Employee\EmployeeGroup::class)->create()->id;
        },
    ];
});

$factory->defineAs(Employee::class, 'admin', function () use ($factory) {
    $user = $factory->raw(Employee::class);
    $user['can_login'] = true;
    $user['email'] ='office@stiftungswo.ch';
    $user['encrypted_password'] = 'Welcome01';
    $user['is_admin'] = true;
    $user['first_name'] = 'Ers';
    $user['first_vacation_takover'] = 0;
    $user['last_name'] = 'Gutermann';
    return $user;
});

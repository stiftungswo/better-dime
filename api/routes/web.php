<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use Laravel\Lumen\Routing\Router;

/** @var Router $router */
$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['namespace' => 'api', 'prefix' => 'api'], function () use ($router) {
    $router->group(['namespace' => 'v1', 'prefix' => 'v1'], function () use ($router) {
        $router->post('employees/login', 'AuthController@authenticate');

        $router->group(['middleware' => 'auth'], function () use ($router) {

            $router->group(['prefix' => 'companies'], function () use ($router) {
                $router->get('/', ['uses' => 'CompanyController@index']);
                $router->post('/', ['uses' => 'CompanyController@post']);
                $router->get('/{id}', ['uses' => 'CompanyController@get']);
                $router->put('/{id}', ['uses' => 'CompanyController@put']);
                $router->delete('/{id}', ['uses' => 'CompanyController@delete']);
            });

            $router->group(['prefix' => 'customer_tags'], function () use ($router) {
                $router->get('/', ['uses' => 'CustomerTagController@index']);
                $router->post('/', ['uses' => 'CustomerTagController@post']);
                $router->put('/{id}', ['uses' => 'CustomerTagController@put']);
                $router->delete('/{id}', ['uses' => 'CustomerTagController@delete']);
            });

            $router->group(['prefix' => 'employees'], function () use ($router) {
                $router->get('/', ['uses' => 'EmployeeController@index']);
                $router->post('/', ['uses' => 'EmployeeController@post']);
                $router->get('/{id}', ['uses' => 'EmployeeController@get']);
                $router->put('/{id}', ['uses' => 'EmployeeController@put']);
                $router->delete('/{id}', ['uses' => 'EmployeeController@delete']);
            });

            $router->group(['prefix' => 'holidays'], function () use ($router) {
                $router->get('/', ['uses' => 'HolidayController@index']);
                $router->post('/', ['uses' => 'HolidayController@post']);
                $router->put('/{id}', ['uses' => 'HolidayController@put']);
                $router->delete('/{id}', ['uses' => 'HolidayController@delete']);
            });

            $router->group(['prefix' => 'offers'], function () use ($router) {
                $router->get('/', ['uses' => 'OfferController@index']);
                $router->post('/', ['uses' => 'OfferController@post']);
                $router->get('/{id}', ['uses' => 'OfferController@get']);
                $router->put('/{id}', ['uses' => 'OfferController@put']);
                $router->delete('/{id}', ['uses' => 'OfferController@delete']);
                $router->get('/{id}/print', ['uses' => 'OfferController@print']);
            });

            $router->group(['prefix' => 'people'], function () use ($router) {
                $router->get('/', ['uses' => 'PersonController@index']);
                $router->post('/', ['uses' => 'PersonController@post']);
                $router->get('/{id}', ['uses' => 'PersonController@get']);
                $router->put('/{id}', ['uses' => 'PersonController@put']);
                $router->delete('/{id}', ['uses' => 'PersonController@delete']);
            });

            $router->group(['prefix' => 'rate_units'], function () use ($router) {
                $router->get('/', ['uses' => 'RateUnitController@index']);
                $router->post('/', ['uses' => 'RateUnitController@post']);
                $router->get('/{id}', ['uses' => 'RateUnitController@get']);
                $router->put('/{id}', ['uses' => 'RateUnitController@put']);
                $router->delete('/{id}', ['uses' => 'RateUnitController@delete']);
            });

            $router->group(['prefix' => 'services'], function () use ($router) {
                $router->get('/', ['uses' => 'ServiceController@index']);
                $router->post('/', ['uses' => 'ServiceController@post']);
                $router->get('/{id}', ['uses' => 'ServiceController@get']);
                $router->put('/{id}', ['uses' => 'ServiceController@put']);
                $router->delete('/{id}', ['uses' => 'ServiceController@delete']);
            });
        });
    });
});

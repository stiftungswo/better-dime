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

            $router->group(['prefix' => 'customers'], function () use ($router) {
                $router->get('/export', ['uses' => 'CustomerController@export']);
                $router->get('/', ['uses' => 'CustomerController@index']);
                $router->get('/{id}', ['uses' => 'CustomerController@get']);
            });

            $router->group(['prefix' => 'companies'], function () use ($router) {
                $router->post('/{id}/duplicate', ['uses' => 'CompanyController@duplicate']);
                $router->get('/', ['uses' => 'CompanyController@index']);
                $router->post('/', ['uses' => 'CompanyController@post']);
                $router->get('/{id}', ['uses' => 'CompanyController@get']);
                $router->put('/{id}', ['uses' => 'CompanyController@put']);
                $router->delete('/{id}', ['uses' => 'CompanyController@delete']);
            });

            $router->group(['prefix' => 'customer_tags'], function () use ($router) {
                $router->put('/{id}/archive', ['uses' => 'CustomerTagController@archive']);
                $router->get('/', ['uses' => 'CustomerTagController@index']);
                $router->post('/', ['uses' => 'CustomerTagController@post']);
                $router->put('/{id}', ['uses' => 'CustomerTagController@put']);
            });

            $router->group(['prefix' => 'employees'], function () use ($router) {
                $router->put('/{id}/archive', ['uses' => 'EmployeeController@archive']);
                $router->post('/{id}/duplicate', ['uses' => 'EmployeeController@duplicate']);
                $router->get('/', ['uses' => 'EmployeeController@index']);
                $router->post('/', ['uses' => 'EmployeeController@post']);
                $router->get('/{id}', ['uses' => 'EmployeeController@get']);
                $router->put('/{id}', ['uses' => 'EmployeeController@put']);
            });

            $router->group(['prefix' => 'employee_settings'], function () use ($router) {
                $router->put('/{id}', ['uses' => 'EmployeeSettingController@put']);
            });

            $router->group(['prefix' => 'invoices'], function () use ($router) {
                $router->get('/', ['uses' => 'InvoiceController@index']);
                $router->post('/', ['uses' => 'InvoiceController@post']);
                $router->get('/{id}', ['uses' => 'InvoiceController@get']);
                $router->put('/{id}', ['uses' => 'InvoiceController@put']);
                $router->delete('/{id}', ['uses' => 'InvoiceController@delete']);
                $router->get('/{id}/print', ['uses' => 'InvoiceController@print']);
                $router->get('/{id}/print_esr', ['uses' => 'InvoiceController@print_esr']);
                $router->get('/{id}/print_effort_report', ['uses' => 'ReportController@printEffortReport']);
            });

            $router->group(['prefix' => 'holidays'], function () use ($router) {
                $router->post('/{id}/duplicate', ['uses' => 'HolidayController@duplicate']);
                $router->get('/', ['uses' => 'HolidayController@index']);
                $router->post('/', ['uses' => 'HolidayController@post']);
                $router->put('/{id}', ['uses' => 'HolidayController@put']);
                $router->delete('/{id}', ['uses' => 'HolidayController@delete']);
            });

            $router->group(['prefix' => 'offers'], function () use ($router) {
                $router->post('/{id}/duplicate', ['uses' => 'OfferController@duplicate']);
                $router->get('/', ['uses' => 'OfferController@index']);
                $router->post('/', ['uses' => 'OfferController@post']);
                $router->get('/{id}', ['uses' => 'OfferController@get']);
                $router->put('/{id}', ['uses' => 'OfferController@put']);
                $router->delete('/{id}', ['uses' => 'OfferController@delete']);
                $router->get('/{id}/print', ['uses' => 'OfferController@print']);
                $router->post('/{id}/create_project', ['uses' => 'OfferController@createProject']);
            });

            $router->group(['prefix' => 'people'], function () use ($router) {
                $router->post('/{id}/duplicate', ['uses' => 'PersonController@duplicate']);
                $router->get('/', ['uses' => 'PersonController@index']);
                $router->post('/', ['uses' => 'PersonController@post']);
                $router->get('/{id}', ['uses' => 'PersonController@get']);
                $router->put('/{id}', ['uses' => 'PersonController@put']);
                $router->delete('/{id}', ['uses' => 'PersonController@delete']);
            });

            $router->group(['prefix' => 'projects'], function () use ($router) {
                $router->put('/{id}/archive', ['uses' => 'ProjectController@archive']);
                $router->post('/{id}/duplicate', ['uses' => 'ProjectController@duplicate']);
                $router->get('/', ['uses' => 'ProjectController@index']);
                $router->post('/', ['uses' => 'ProjectController@post']);
                $router->get('/{id}', ['uses' => 'ProjectController@get']);
                $router->put('/{id}', ['uses' => 'ProjectController@put']);
                $router->delete('/{id}', ['uses' => 'ProjectController@delete']);
                $router->put('/{id}/move_efforts', ['uses' => 'ProjectController@moveEfforts']);
                $router->post('/{id}/create_invoice', ['uses' => 'ProjectController@createInvoice']);
            });

            $router->group(['prefix' => 'project_categories'], function () use ($router) {
                $router->put('/{id}/archive', ['uses' => 'ProjectCategoryController@archive']);
                $router->get('/', ['uses' => 'ProjectCategoryController@index']);
                $router->post('/', ['uses' => 'ProjectCategoryController@post']);
                $router->put('/{id}', ['uses' => 'ProjectCategoryController@put']);
                $router->delete('/{id}', ['uses' => 'ProjectCategoryController@delete']);
            });

            $router->group(['prefix' => 'project_comments'], function () use ($router) {
                $router->delete('/{id}', ['uses' => 'ProjectCommentController@delete']);
                $router->get('/', ['uses' => 'ProjectCommentController@index']);
                $router->get('/{id}', ['uses' => 'ProjectCommentController@get']);
                $router->post('/', ['uses' => 'ProjectCommentController@post']);
                $router->put('/{id}', ['uses' => 'ProjectCommentController@put']);
            });

            $router->group(['prefix' => 'project_efforts'], function () use ($router) {
                $router->delete('/{id}', ['uses' => 'ProjectEffortController@delete']);
                $router->get('/', ['uses' => 'ProjectEffortController@index']);
                $router->get('/{id}', ['uses' => 'ProjectEffortController@get']);
                $router->post('/', ['uses' => 'ProjectEffortController@post']);
                $router->put('/{id}', ['uses' => 'ProjectEffortController@put']);
            });

            $router->group(['prefix' => 'rate_units'], function () use ($router) {
                $router->put('/{id}/archive', ['uses' => 'RateUnitController@archive']);
                $router->get('/', ['uses' => 'RateUnitController@index']);
                $router->post('/', ['uses' => 'RateUnitController@post']);
                $router->get('/{id}', ['uses' => 'RateUnitController@get']);
                $router->put('/{id}', ['uses' => 'RateUnitController@put']);
            });

            $router->group(['prefix' => 'rate_groups'], function () use ($router) {
                $router->get('/', ['uses' => 'RateGroupController@index']);
            });

            $router->group(['prefix' => 'services'], function () use ($router) {
                $router->put('/{id}/archive', ['uses' => 'ServiceController@archive']);
                $router->post('/{id}/duplicate', ['uses' => 'ServiceController@duplicate']);
                $router->get('/', ['uses' => 'ServiceController@index']);
                $router->post('/', ['uses' => 'ServiceController@post']);
                $router->get('/{id}', ['uses' => 'ServiceController@get']);
                $router->put('/{id}', ['uses' => 'ServiceController@put']);
            });

            $router->group(['prefix' => 'work_periods'], function () use ($router) {
                $router->delete('/{id}', ['uses' => 'WorkPeriodController@delete']);
                $router->get('/', ['uses' => 'WorkPeriodController@index']);
                $router->post('/', ['uses' => 'WorkPeriodController@post']);
                $router->put('/{id}', ['uses' => 'WorkPeriodController@put']);
            });

            $router->group(['prefix' => 'costgroups'], function () use ($router) {
                $router->get('/', ['uses' => 'CostgroupController@index']);
            });
        });
    });
});

<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     * @throws \Exception
     */
    public function boot()
    {
        $neededConfig = ['SENDER_NAME', 'SENDER_STREET', 'SENDER_PLZ', 'SENDER_CITY', 'SENDER_PHONE', 'SENDER_MAIL', 'SENDER_WEB'];

        foreach ($neededConfig as $config) {
            if (is_null(env($config)) || empty(env($config))) {
                throw new \Exception('Needed config variable ' . $config . ' is not set! Check your .env in the application root');
            }
        }

        if (!is_dir(base_path('storage/fonts'))) {
            mkdir(base_path('storage/fonts'));
        }
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class GlobalSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('global_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->string('sender_name')->default('Example Company');
            $table->string('sender_street')->default('Test street 1');
            $table->string('sender_zip')->default('1234');
            $table->string('sender_city')->default('Zürich');
            $table->string('sender_phone')->default('044 333 44 55');
            $table->string('sender_mail')->default('dime@example.com');
            $table->string('sender_vat')->default('CHE-123.456.543');
            $table->string('sender_bank')->default('07-007-07');
            $table->string('sender_web')->default('https://github.com/stiftungswo/betterDime');
            $table->timestamps();
        });

        //This table is supposed to have only one row. It is created here.
        $model = new \App\Models\GlobalSettings();
        $model->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('global_settings');
    }
}

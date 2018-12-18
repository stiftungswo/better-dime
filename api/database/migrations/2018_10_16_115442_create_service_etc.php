<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServiceEtc extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rate_groups', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('description')->nullable();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->double('vat');
            $table->boolean('archived');

            $table->timestamps();
            $table->softDeletes();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('rate_units', function (Blueprint $table) {
            $table->increments('id');
            $table->string('billing_unit');
            $table->string('effort_unit')->nullable();
            $table->double('factor')->default(1);
            $table->boolean('is_time');
            $table->string('name');
            $table->boolean('archived')->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('service_rates', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('rate_group_id');
            $table->foreign('rate_group_id')->references('id')->on('rate_groups');
            $table->unsignedInteger('service_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->unsignedInteger('rate_unit_id');
            $table->foreign('rate_unit_id')->references('id')->on('rate_units')->onDelete('cascade');
            $table->integer("value");

            $table->timestamps();
            $table->softDeletes();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();

            $table->unique(['service_id', 'rate_group_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('rates');
        Schema::drop('rate_groups');
        Schema::drop('rate_units');
        Schema::drop('services');
    }
}

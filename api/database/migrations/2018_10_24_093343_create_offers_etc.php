<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOffersEtc extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('accountant_id');
            $table->foreign('accountant_id')->references('id')->on('employees');
            $table->unsignedInteger('address_id');
            $table->foreign('address_id')->references('id')->on('addresses');
            $table->integer('customer_id');
            $table->string('customer_type');
            $table->text('description');
            $table->integer('fixed_price')->nullable();
            $table->string('name');
            $table->unsignedInteger('rate_group_id');
            $table->foreign('rate_group_id')->references('id')->on('rate_groups');
            $table->text('short_description');
            $table->tinyInteger('status');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('offer_positions', function (Blueprint $table) {
            $table->increments('id');
            $table->decimal('amount');
            $table->unsignedInteger('offer_id');
            $table->foreign('offer_id')->references('id')->on('offers');
            $table->integer('order');
            $table->integer('price_per_rate');
            $table->unsignedInteger('rate_unit_id');
            $table->foreign('rate_unit_id')->references('id')->on('rate_units');
            $table->unsignedInteger('service_id');
            $table->foreign('service_id')->references('id')->on('services');
            $table->decimal('vat', 4, 3);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('offer_discounts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('offer_id');
            $table->foreign('offer_id')->references('id')->on('offers');
            $table->boolean('percentage');
            $table->decimal('value', 10, 3);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('offer_discounts');
        Schema::dropIfExists('offer_positions');
        Schema::dropIfExists('offers');
    }
}

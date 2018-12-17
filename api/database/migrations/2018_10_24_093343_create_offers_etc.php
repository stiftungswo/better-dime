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
            $table->unsignedInteger('accountant_id')->nullable();
            $table->foreign('accountant_id')->references('id')->on('employees')->onDelete('set null');
            $table->unsignedInteger('customer_id')->nullable();
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
            $table->unsignedInteger('address_id')->nullable();
            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('set null');
            $table->text('description')->nullable();
            $table->integer('fixed_price')->nullable();
            $table->string('name');
            $table->unsignedInteger('rate_group_id');
            $table->foreign('rate_group_id')->references('id')->on('rate_groups');
            $table->text('short_description')->nullable();
            $table->tinyInteger('status')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('offer_positions', function (Blueprint $table) {
            $table->increments('id');
            $table->decimal('amount');
            $table->string('description')->nullable()->default(null);
            $table->unsignedInteger('offer_id');
            $table->foreign('offer_id')->references('id')->on('offers')->onDelete('cascade');
            $table->integer('order');
            $table->integer('price_per_rate');
            $table->unsignedInteger('rate_unit_id')->nullable();
            $table->foreign('rate_unit_id')->references('id')->on('rate_units')->onDelete('set null');
            $table->unsignedInteger('service_id')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');
            $table->decimal('vat', 4, 3);

            $table->softDeletes();
            $table->timestamps();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('offer_discounts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('offer_id');
            $table->foreign('offer_id')->references('id')->on('offers')->onDelete('cascade');
            $table->boolean('percentage')->default(false);
            $table->decimal('value', 10, 3);

            $table->softDeletes();
            $table->timestamps();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
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

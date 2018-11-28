<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type');

            $table->text('comment')->nullable();
            $table->unsignedInteger('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('customers')->onDelete('cascade');
            $table->string('department')->nullable();
            $table->string('email');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->boolean('hidden')->default(false);
            $table->string('name')->nullable();
            $table->unsignedInteger('rate_group_id');
            $table->foreign('rate_group_id')->references('id')->on('rate_groups');
            $table->string('salutation')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('customer_tags', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('archived')->default(false);
            $table->string('name');

            $table->timestamps();
            $table->softDeletes();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('customer_taggable', function (Blueprint $table) {
            $table->integer('customer_tag_id');
            $table->integer('customer_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customer_taggable');
        Schema::dropIfExists('customer_tags');
        Schema::dropIfExists('people');
        Schema::dropIfExists('companies');
    }
}

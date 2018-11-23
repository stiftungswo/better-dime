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
        Schema::create('companies', function (Blueprint $table) {
            $table->increments('id');
            $table->text('comment');
            $table->string('email');
            $table->boolean('hidden')->default(false);
            $table->string('name');
            $table->unsignedInteger('rate_group_id')->nullable();
            $table->foreign('rate_group_id')->references('id')->on('rate_groups')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('people', function (Blueprint $table) {
            $table->increments('id');
            $table->text('comment');
            $table->unsignedInteger('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('department')->nullable();
            $table->string('email');
            $table->string('first_name');
            $table->boolean('hidden')->default(false);
            $table->string('last_name');
            $table->unsignedInteger('rate_group_id')->nullable();
            $table->foreign('rate_group_id')->references('id')->on('rate_groups')->onDelete('set null');
            $table->string('salutation');

            $table->timestamps();
            $table->softDeletes();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('customer_tags', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');

            $table->timestamps();
            $table->softDeletes();

            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('deleted_by')->nullable();
        });

        Schema::create('customer_taggables', function (Blueprint $table) {
            $table->integer('customer_tag_id');
            $table->integer('customer_taggable_id');
            $table->string('customer_taggable_type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customer_taggables');
        Schema::dropIfExists('customer_tags');
        Schema::dropIfExists('people');
        Schema::dropIfExists('companies');
    }
}

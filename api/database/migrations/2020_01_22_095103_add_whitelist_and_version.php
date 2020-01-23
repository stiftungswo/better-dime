<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddWhitelistAndVersion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('whitelisted_jwts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('jti');
            $table->string('aud')->nullable();
            $table->dateTime('exp');
            $table->unsignedInteger('employee_id')->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('set null');
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
        });

        Schema::create('versions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('item_type', 191);
            $table->bigInteger('item_id');
            $table->string('event');
            $table->string('whodunnit')->nullable();
            $table->longText('object')->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('whitelisted_jwts');
        Schema::dropIfExists('versions');
    }
}

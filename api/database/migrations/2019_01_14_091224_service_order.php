<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ServiceOrder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->integer('order')->default(0);
        });

        Schema::table('global_settings', function (Blueprint $table) {
            $table->string('service_order_comment');
        });

        Schema::table('project_positions', function (Blueprint $table) {
            $table->integer('order')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('order');
        });

        Schema::table('global_settings', function (Blueprint $table) {
            $table->dropColumn('service_order_comment');
        });

        Schema::table('project_positions', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }
}

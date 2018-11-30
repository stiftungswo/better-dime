<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PortEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('employees', function (Blueprint $table) {
            $table->string('first_name');
            $table->string('last_name');
            $table->boolean('can_login')->default(false);
            $table->boolean('archived')->default(false);
            $table->integer('holidays_per_year')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('first_name');
            $table->dropColumn('last_name');
            $table->dropColumn('can_login');
            $table->dropColumn('archived');
            $table->dropColumn('holidays_per_year');
            $table->dropSoftDeletes();
        });
    }
}

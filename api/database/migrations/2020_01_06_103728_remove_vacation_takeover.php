<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveVacationTakeover extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('work_periods', function (Blueprint $table) {
            $table->dropColumn('vacation_takeover');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('work_periods', function (Blueprint $table) {
            $table->decimal('vacation_takeover');
        });
    }
}

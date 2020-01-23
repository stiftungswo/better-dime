<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameStartEnd extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->renameColumn('start', 'beginning');
            $table->renameColumn('end', 'ending');
        });

        Schema::table('work_periods', function (Blueprint $table) {
            $table->renameColumn('start', 'beginning');
            $table->renameColumn('end', 'ending');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->renameColumn('beginning', 'start');
            $table->renameColumn('ending', 'end');
        });

        Schema::table('work_periods', function (Blueprint $table) {
            $table->renameColumn('beginning', 'start');
            $table->renameColumn('ending', 'end');
        });
    }
}

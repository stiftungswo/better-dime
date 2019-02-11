<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMoreBankingSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('global_settings', function (Blueprint $table) {
            $table->string('sender_bank_detail')->default('Example Bank, 0000 Example');
            $table->string('sender_bank_iban')->default('CH00 0000 0000 0000 0000 0');
            $table->string('sender_bank_bic')->default('EXABANK00000');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('global_settings', function (Blueprint $table) {
            $table->dropColumn('sender_bank_detail');
            $table->dropColumn('sender_bank_iban');
            $table->dropColumn('sender_bank_bic');
        });
    }
}

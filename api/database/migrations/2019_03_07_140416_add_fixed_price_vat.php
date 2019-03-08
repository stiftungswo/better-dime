<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFixedPriceVat extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->decimal('fixed_price_vat', 4, 3)->nullable();
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->decimal('fixed_price_vat', 4, 3)->nullable();
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
            $table->dropColumn('fixed_price_vat');
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->dropColumn('fixed_price_vat');
        });
    }
}

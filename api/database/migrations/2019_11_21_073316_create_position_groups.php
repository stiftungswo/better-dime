<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePositionGroups extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('position_groups', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');

            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('offer_positions', function (Blueprint $table) {
            $table->unsignedInteger('position_group_id')->nullable();
            $table->foreign('position_group_id')->references('id')->on('position_groups')->onDelete('set null');
        });

        Schema::table('project_positions', function (Blueprint $table) {
            $table->unsignedInteger('position_group_id')->nullable();
            $table->foreign('position_group_id')->references('id')->on('position_groups')->onDelete('set null');
        });

        Schema::table('invoice_positions', function (Blueprint $table) {
            $table->unsignedInteger('position_group_id')->nullable();
            $table->foreign('position_group_id')->references('id')->on('position_groups')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('offer_positions', function (Blueprint $table) {
            $table->dropForeign(['position_group_id']);
            $table->dropColumn('position_group_id');
        });

        Schema::table('project_positions', function (Blueprint $table) {
            $table->dropForeign(['position_group_id']);
            $table->dropColumn('position_group_id');
        });

        Schema::table('invoice_positions', function (Blueprint $table) {
            $table->dropForeign(['position_group_id']);
            $table->dropColumn('position_group_id');
        });

        Schema::dropIfExists('position_groups');
    }
}

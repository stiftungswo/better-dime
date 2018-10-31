<?php

use App\Models\Employee\EmployeeSetting;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('employee_id')->nullable()->unique();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_settings');
    }
}

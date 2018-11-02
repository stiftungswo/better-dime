<?php

namespace Tests\Unit\Models\Invoice;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Invoice\Costgroup;
use App\Models\Invoice\Invoice;
use App\Models\Project\Project;
use Laravel\Lumen\Testing\DatabaseTransactions;

class InvoiceTest extends \TestCase
{

    use DatabaseTransactions;

    public function testGetEmptyCostgroupsAttribute()
    {
        // should return empty array if no costgroups are assigned
        $invoice = factory(Invoice::class)->create();
        $this->assertEmpty($invoice->costgroups);
    }

    public function testGetPopulatedCostgroupsAttribute()
    {
        $invoice = factory(Invoice::class)->create();
        $invoice->invoice_costgroups()->saveMany(factory(Costgroup::class)->times(5)->make());
        $this->assertCount(5, $invoice->costgroups);
    }

    public function testAccountantAssignment()
    {
        $accountant = factory(Employee::class)->make();
        $invoice = factory(Invoice::class)->make();
        $invoice->accountant()->associate($accountant);
        $this->assertEquals($accountant, $invoice->accountant);
    }

    public function testAddressAssignment()
    {
        $address = factory(Address::class)->make();
        $invoice = factory(Invoice::class)->make();
        $invoice->address()->associate($address);
        $this->assertEquals($address, $invoice->address);
    }

    public function testProjectAssignment()
    {
        $project = factory(Project::class)->make();
        $invoice = factory(Invoice::class)->make();
        $invoice->project()->associate($project);
        $this->assertEquals($project, $invoice->project);
    }
}

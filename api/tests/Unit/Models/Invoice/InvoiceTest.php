<?php

namespace Tests\Unit\Models\Invoice;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Invoice\Invoice;
use App\Models\Project\Project;

class InvoiceTest extends \TestCase
{

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

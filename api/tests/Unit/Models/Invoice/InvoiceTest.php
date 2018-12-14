<?php

namespace Tests\Unit\Models\Invoice;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Invoice\Costgroup;
use App\Models\Invoice\InvoiceCostgroupDistribution;
use App\Models\Invoice\Invoice;
use App\Models\Project\Project;
use Laravel\Lumen\Testing\DatabaseTransactions;

class InvoiceTest extends \TestCase
{
    use DatabaseTransactions;

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

    public function testEmptyDistributionOfCostgroup()
    {
        $invoice = factory(Invoice::class)->create();
        $this->assertEmpty($invoice->distribution_of_costgroups);
    }

    public function testPopulatedDistributionOfCostgroup()
    {
        $invoice = factory(Invoice::class)->create();
        $costgroup1 = factory(Costgroup::class)->create();
        $costgroup2 = factory(Costgroup::class)->create();
        factory(InvoiceCostgroupDistribution::class)->create([
            'invoice_id' => $invoice->id,
            'costgroup_number' => $costgroup1->number,
            'weight' => 60
        ]);
        factory(InvoiceCostgroupDistribution::class)->create([
            'invoice_id' => $invoice->id,
            'costgroup_number' => $costgroup2->number,
            'weight' => 40
        ]);

        $this->assertContains([
            'costgroup_number' => $costgroup1->number,
            'ratio' => 60
        ], $invoice->distribution_of_costgroups);
        $this->assertContains([
            'costgroup_number' => $costgroup2->number,
            'ratio' => 40
        ], $invoice->distribution_of_costgroups);
    }
}

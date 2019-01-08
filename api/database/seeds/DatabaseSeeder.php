<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create('de_CH');
        print("Seeding employees ...\n");
        factory(\App\Models\Employee\Employee::class, 'admin')->create();
        $employees = factory(\App\Models\Employee\Employee::class, 20)->create();
        $employees->each(function ($e) {
            /** @var \App\Models\Employee\Employee $e */
            factory(\App\Models\Employee\WorkPeriod::class, rand(1, 3))->create([
                'employee_id' => $e->id
            ]);
        });

        print("Seeding public holidays ...\n");
        factory(\App\Models\Employee\Holiday::class)->times(10)->create();

        print("Seeding rate groups ...\n");
        $kanton = factory(\App\Models\Service\RateGroup::class, 'kanton')->create();
        $andere = factory(\App\Models\Service\RateGroup::class, 'andere')->create();

        print("Seeding rate units ...\n");
        $rateUnits = collect([factory(\App\Models\Service\RateUnit::class)->create([
            'billing_unit' => 'CHF / min',
            'effort_unit' => 'min',
            'factor' => 1,
            'is_time' => true,
            'name' => 'Minuten',
            'archived' => false
        ]), factory(\App\Models\Service\RateUnit::class)->create([
            'billing_unit' => 'CHF / h',
            'effort_unit' => 'h',
            'factor' => 60,
            'is_time' => true,
            'name' => 'Stunden',
            'archived' => false
        ]), factory(\App\Models\Service\RateUnit::class)->create([
            'billing_unit' => 'CHF / t',
            'effort_unit' => 't',
            'factor' => 504,
            'is_time' => true,
            'name' => 'Tage',
            'archived' => false
        ]), factory(\App\Models\Service\RateUnit::class)->create([
            'billing_unit' => 'CHF / Stk.',
            'effort_unit' => 'Stk.',
            'factor' => 1,
            'is_time' => false,
            'name' => 'Stück',
            'archived' => false
        ]), factory(\App\Models\Service\RateUnit::class)->create([
            'billing_unit' => 'pau',
            'effort_unit' => 'pau',
            'factor' => 1,
            'is_time' => false,
            'name' => 'Pauschal',
            'archived' => false
        ]), factory(\App\Models\Service\RateUnit::class)->create([
            'billing_unit' => 'CHF / m',
            'effort_unit' => 'm',
            'factor' => 1,
            'is_time' => false,
            'name' => 'Laufmeter',
            'archived' => false
        ])]);

        print("Seeding services and service rates ...\n");
        $services = factory(\App\Models\Service\Service::class)->times(10)->create();
        $services->each(function ($s) use ($kanton, $andere, $rateUnits) {
            factory(\App\Models\Service\ServiceRate::class)->create([
                'rate_group_id' => $kanton,
                'service_id' => $s,
                'rate_unit_id' => $rateUnits->random()->id
            ]);

            factory(\App\Models\Service\ServiceRate::class)->create([
                'rate_group_id' => $andere,
                'service_id' => $s,
                'rate_unit_id' => $rateUnits->random()->id
            ]);
        });

        $customerTags = factory(App\Models\Customer\CustomerTag::class)->times(10)->create();

        print("Seeding companies ...\n");
        $companies = factory(\App\Models\Customer\Company::class)->times(10)->create([
            'rate_group_id' => function () {
                return \App\Models\Service\RateGroup::all()->random()->id;
            }
        ]);

        $companies->each(function ($c, $i) use ($customerTags) {
            $min = $i === 0 ? 1 : 0; //make sure at least one company has an address

            /** @var \App\Models\Customer\Company $c */
            $c->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->create([
                'customer_id' => $c->id
            ]);
            factory(\App\Models\Customer\Address::class)->times(rand($min, 2))->create([
                'customer_id' => $c->id
            ]);
        });

        print("Seeding people ...\n");
        $people = factory(\App\Models\Customer\Person::class)->times(10)->create([
            'company_id' => null,
            'rate_group_id' => function () {
                return \App\Models\Service\RateGroup::all()->random()->id;
            }
        ]);

        $people->each(function ($p, $i) use ($customerTags) {
            $min = $i === 0 ? 1 : 0; //make sure at least one person has an address

            /** @var \App\Models\Customer\Person $p */
            $p->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->create([
                'customer_id' => $p->id
            ]);
            factory(\App\Models\Customer\Address::class)->times(rand($min, 2))->create([
                'customer_id' => $p->id
            ]);
        });

        print("Attaching some people to a company ...\n");
        $people->slice(ceil(count($people) / 2))->each(function ($p) use ($companies) {
            /** @var \App\Models\Customer\Person $p */
            $p->company()->associate($companies->random());
            $p->save();
        });

        print("Fetching entites for later seeding steps ...\n");
        $customersWithAddresses = \App\Models\Customer\Company::with('addresses')->get()->filter(function ($c) {
            return $c->addresses->isNotEmpty();
        });
        $rateGroups = \App\Models\Service\RateGroup::all();

        print("Seeding offers ...\n");
        $offers = collect([]);
        for ($i = 0; $i < 20; $i++) {
            $customer = $customersWithAddresses->random();
            $offers->push(factory(\App\Models\Offer\Offer::class)->create([
                'accountant_id' => $employees->random()->id,
                'address_id' => $customer->addresses->random()->id,
                'customer_id' => $customer->id,
                'rate_group_id' => $rateGroups->random()->id
            ]));
        }

        print("Seeding offer positions and discounts ...\n");
        $offers->each(function ($o) use ($rateUnits, $services) {
            /** @var \App\Models\Offer\Offer $o */
            foreach (range(1, rand(2, 5)) as $i) {
                factory(\App\Models\Offer\OfferPosition::class)->create([
                    'offer_id' => $o->id,
                    'rate_unit_id' => $rateUnits->random()->id,
                    'service_id' => $services->random()->id
                ]);
            }

            factory(\App\Models\Offer\OfferDiscount::class)->times(rand(0, 2))->create([
                'offer_id' => $o->id,
            ]);
        });

        print("Seeding costgroups ...\n");
        $costgroups = factory(\App\Models\Costgroup\Costgroup::class, 6)->create();

        print("Seeding project categories ...\n");
        $projectCategories = factory(\App\Models\Project\ProjectCategory::class, 10)->create();

        print("Seeding projects ...\n");
        $projectsWithOffer = collect([]);
        //leave some offers without a corresponding project
        $offersWithProject = $offers->slice(0, -5);
        $offersWithProject->each(function ($o) use ($projectsWithOffer) {
            $creator = new \App\Services\Creator\CreateProjectFromOffer($o);
            $projectsWithOffer[] = $creator->create();
        });

        $projectsWithoutOffer = collect([]);
        for ($i = 0; $i < 5; $i++) {
            $customer = $customersWithAddresses->random();

            $projectsWithoutOffer->push(factory(\App\Models\Project\Project::class)->create([
                'accountant_id' => $employees->random()->id,
                'address_id' => $customer->addresses->random()->id,
                'category_id' => $projectCategories->random()->id,
                'customer_id' => $customer->id,
                'offer_id' => null,
                'rate_group_id' => $rateGroups->random()->id
            ]));
        }

        $projects = $projectsWithOffer->concat($projectsWithoutOffer);
        $projects->each(function ($p) use ($projectCategories, $costgroups) {
            /** @var \App\Models\Project\Project $p */
            factory(\App\Models\Project\ProjectComment::class)->times(rand(0, 10))->create([
                'project_id' => $p->id
            ]);

            factory(\App\Models\Project\ProjectCostgroupDistribution::class, 2)->create([
                'costgroup_number' => function () use ($costgroups) {
                    return $costgroups->random()->number;
                },
                'project_id' => $p->id,
            ]);
        });

        print("Seeding holiday project ...\n");
        $customer = $customersWithAddresses->random();
        $holidayProject = factory(\App\Models\Project\Project::class)->create([
            'accountant_id' => $employees->random()->id,
            'address_id' => $customer->addresses->random()->id,
            'category_id' => $projectCategories->random()->id,
            'customer_id' => $customer->id,
            'offer_id' => null,
            'rate_group_id' => $rateGroups->random()->id,
            'vacation_project' => true,
        ]);

        factory(\App\Models\Project\ProjectPosition::class)->create([
            'description' => 'Ferien',
            'project_id' => $holidayProject->id,
            'rate_unit_id' => $rateUnits->firstWhere('is_time', true)->id,
            'service_id' => $services->random()->id
        ]);

        $projects = $projects->merge([$holidayProject]);

        print("Seeding project efforts ...\n");
        \App\Models\Employee\WorkPeriod::all()->each(function ($wp) use ($faker, $projects) {
            $projects->map(function ($p) {
                return $p->positions;
            })->flatten()->each(function ($pp) use ($faker, $wp) {
                $date = $faker->dateTimeBetween($wp->start, $wp->end);

                factory(\App\Models\Project\ProjectEffort::class)->times(rand(0, 2))->create([
                    'employee_id' => $wp->employee->id,
                    'date' => $date,
                    'position_id' => $pp->id
                ]);
            });
        });

        $invoices = collect([]);
        print("Seeding invoices ...\n");
        $projectsWithInvoice = $projectsWithOffer->slice(0, -3)->concat($projectsWithoutOffer->slice(0, -2));

        //have some projects with multiple invoices
        $projectsWithInvoice = $projectsWithInvoice->concat($projectsWithInvoice->random(5));
        $projectsWithInvoice->each(function ($p) use ($invoices) {
            $creator = new \App\Services\Creator\CreateInvoiceFromProject($p);
            $invoices[] = $creator->create();
        });

        // create some invoices without a project
        for ($i = 0; $i < 5; $i++) {
            $customer = $customersWithAddresses->random();

            $invoice = factory(\App\Models\Invoice\Invoice::class)->create([
                'accountant_id' => $employees->random()->id,
                'address_id' => $customer->addresses->random()->id,
                'customer_id' => $customer->id,
                'project_id' => null,
            ]);
            $invoices->push($invoice);

            factory(\App\Models\Invoice\InvoicePosition::class, rand(0, 5))->create([
                'invoice_id' => $invoice->id,
                'project_position_id' => null,
                'rate_unit_id' => function () use ($rateUnits) {
                    return $rateUnits->random()->id;
                }
            ]);
        }

        $invoices->each(function ($i) use ($costgroups) {
            factory(\App\Models\Invoice\InvoiceCostgroupDistribution::class, 2)->create([
                'costgroup_number' => $costgroups->random()->number,
                'invoice_id' => $i->id,
            ]);
        });
    }
}

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
            $e->work_periods()->saveMany(factory(\App\Models\Employee\WorkPeriod::class, rand(1, 3))->make());
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
            $min = $i===0 ? 1 : 0; //make sure at least one company has an address

            /** @var \App\Models\Customer\Company $c */
            $c->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            $c->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
            $c->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand($min, 2))->make());
        });

        print("Seeding people ...\n");
        $people = factory(\App\Models\Customer\Person::class)->times(10)->create([
            'rate_group_id' => function () {
                return \App\Models\Service\RateGroup::all()->random()->id;
            }
        ]);

        $people->each(function ($p, $i) use ($customerTags) {
            $min = $i===0 ? 1 : 0; //make sure at least one person has an address

            /** @var \App\Models\Customer\Person $p */
            $p->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            $p->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
            $p->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand($min, 2))->make());
        });

        print("Attaching some people to a company ...\n");
        $people->slice(ceil(count($people) / 2))->each(function ($p) use ($companies) {
            /** @var \App\Models\Customer\Person $p */
            $p->company()->associate($companies->random());
            $p->save();
        });

        print("Fetching entites for later seeding steps ...\n");
        $customers = \App\Models\Customer\Company::with('addresses')->get()->filter(function ($c) {
            return $c->addresses->isNotEmpty();
        });
        $rateGroups = \App\Models\Service\RateGroup::all();

        print("Seeding offers ...\n");
        $offers = collect([]);
        for ($i = 0; $i < 20; $i++) {
            $customer = $customers->random();
            $offers->push(factory(\App\Models\Offer\Offer::class)->create([
                'accountant_id' => $employees->random()->id,
                'customer_id' => $customer->id,
                'address_id' => $customer->addresses->random()->id,
                'rate_group_id' => $rateGroups->random()->id
            ]));
        }

        print("Seeding offer positions and discounts ...\n");
        $offers->each(function ($o) use ($rateUnits, $services) {
            /** @var \App\Models\Offer\Offer $o */
            $positions = [];
            foreach (range(1, rand(2, 5)) as $i) {
                $positions[] = factory(\App\Models\Offer\OfferPosition::class)->make([
                    'offer_id' => $o->id,
                    'rate_unit_id' => $rateUnits->random()->id,
                    'service_id' => $services->random()->id
                ]);
            }
            $o->positions()->saveMany($positions);
            $o->discounts()->saveMany(factory(\App\Models\Offer\OfferDiscount::class)->times(rand(0, 2))->make([
                'offer_id' => $o->id,
            ]));
        });

        print("Seeding project categories ...\n");
        $projectCategories = factory(\App\Models\Project\ProjectCategory::class, 10)->create();

        print("Seeding projects ...\n");
        $projects = collect([]);
        $offers->each(function ($o) use ($projects) {
            $creator = new \App\Services\Creator\CreateProjectFromOffer($o);
            $projects[] = $creator->create();
        });

        $projects->each(function ($p) use ($projectCategories) {
            /** @var \App\Models\Project\Project $p */
            $p->update([
                'category_id' => $projectCategories->random()->id,
            ]);
            $p->comments()->saveMany(factory(\App\Models\Project\ProjectComment::class)->times(rand(0, 10))->make([
                'project_id' => $p->id
            ]));
        });

        print("Seeding holiday project ...\n");
        $customer = $customers->random();
        $holidayProject = factory(\App\Models\Project\Project::class)->create([
            'accountant_id' => $employees->random()->id,
            'customer_id' => $customer->id,
            'address_id' => $customer->addresses->random()->id,
            'category_id' => $projectCategories->random()->id,
            'vacation_project' => true,
            'rate_group_id' => $rateGroups->random()->id
        ]);

        $holidayProject->positions()->save(factory(\App\Models\Project\ProjectPosition::class)->make([
            'description' => 'Ferien',
            'rate_unit_id' => $rateUnits->firstWhere('is_time', true)->id,
            'service_id' => $services->random()->id
        ]));

        $projects = $projects->merge([$holidayProject]);

        print("Seeding project efforts ...\n");
        \App\Models\Employee\WorkPeriod::all()->each(function ($wp) use ($faker, $projects) {
            $projects->map(function ($p) {
                return $p->positions;
            })->flatten()->each(function ($pp) use ($faker, $wp) {
                $date = $faker->dateTimeBetween($wp->start, $wp->end);

                $pp->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class)->times(rand(0, 2))->make([
                    'employee_id' => $wp->employee->id,
                    'date' => $date,
                    'position_id' => $pp->id
                ]));
            });
        });

        $invoices = collect([]);
        print("Seeding invoices ...\n");
        $projects->each(function ($p) use ($invoices) {
            $creator = new \App\Services\Creator\CreateInvoiceFromProject($p);
            $invoices[] = $creator->create();
        });

        print("Seeding costgroups ...\n");
        $costgroups = factory(\App\Models\Invoice\Costgroup::class, 6)->create();

        $invoices->each(function ($i) use ($costgroups) {
            $i->costgroup_distributions()->saveMany([factory(\App\Models\Invoice\InvoiceCostgroupDistribution::class)->make([
                'costgroup_number' => $costgroups->random()->number,
                'invoice_id' => $i->id,
            ]), factory(\App\Models\Invoice\InvoiceCostgroupDistribution::class)->make([
                'costgroup_number' => $costgroups->random()->number,
                'invoice_id' => $i->id,
            ])]);
        });
    }
}

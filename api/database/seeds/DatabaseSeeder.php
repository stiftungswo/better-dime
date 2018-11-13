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
        $rateUnits = factory(\App\Models\Service\RateUnit::class)->times(5)->create();

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
            'rate_group_id' => \App\Models\Service\RateGroup::all()->random()->id
        ]);
        $companies->each(function ($c) use ($customerTags) {
            /** @var \App\Models\Customer\Company $c */
            $c->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            $c->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
            $c->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand(0, 2))->make());
        });

        print("Seeding people ...\n");
        $people = factory(\App\Models\Customer\Person::class)->times(10)->create([
            'rate_group_id' => \App\Models\Service\RateGroup::all()->random()->id
        ]);

        $people->each(function ($p) use ($customerTags) {
            /** @var \App\Models\Customer\Person $p */
            $p->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            $p->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
            $p->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand(0, 2))->make());
        });

        print("Attaching some people to a company ...\n");
        $people->slice(ceil(count($people) / 2))->each(function ($p) use ($companies) {
            $p->company()->associate($companies->random());
            $p->save();
        });

        print("Fetching entites for later seeding steps ...\n");
        $addresses = \App\Models\Customer\Address::all();
        $rateGroups = \App\Models\Service\RateGroup::all();

        print("Seeding offers ...\n");
        $offers = collect([]);
        for ($i = 0; $i < 20; $i++) {
            $offers->push(factory(\App\Models\Offer\Offer::class)->create([
                'accountant_id' => $employees->random()->id,
                'address_id' => $addresses->random()->id,
                'rate_group_id' => $rateGroups->random()->id
            ]));
        }

        print("Seeding offer positions and discounts ...\n");
        $offers->each(function ($o) use ($rateUnits, $services) {
            /** @var \App\Models\Offer\Offer $o */
            $o->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class)->times(rand(0, 5))->make([
                'rate_unit_id' => $rateUnits->random()->id,
                'service_id' => $services->random()->id
            ]));
            $o->discounts()->saveMany(factory(\App\Models\Offer\OfferDiscount::class)->times(rand(0, 2))->make());
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
            $p->comments()->saveMany(factory(\App\Models\Project\ProjectComment::class)->times(rand(0, 5))->make());
        });

        print("Seeding holiday projects ...\n");
        $holidayProject = factory(\App\Models\Project\Project::class)->create([
            'accountant_id' => $employees->random()->id,
            'address_id' => $addresses->random()->id,
            'category_id' => $projectCategories->random()->id,
            'vacation_project' => true,
            'rate_group_id' => $rateGroups->random()->id
        ]);

        $holidayProject->positions()->save(factory(\App\Models\Project\ProjectPosition::class)->make([
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
                    'date' => $date
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
            $i->costgroup_distributions()->saveMany([factory(\App\Models\Invoice\CostgroupDistribution::class)->make([
                'costgroup_number' => $costgroups->random()->number
            ]), factory(\App\Models\Invoice\CostgroupDistribution::class)->make([
                'costgroup_number' => $costgroups->random()->number
            ])]);
        });
    }
}

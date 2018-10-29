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
        app(\Faker\Generator::class)->seed();
        factory(\App\Models\Employee\Employee::class, 'admin')->create();
        factory(\App\Models\Employee\Holiday::class)->times(10)->create();

        print("Seeding rate units ...\n");
        $kanton = factory(\App\Models\Service\RateGroup::class, 'kanton')->create();
        $andere = factory(\App\Models\Service\RateGroup::class, 'andere')->create();

        print("Seeding rate groups ...\n");
        $rateUnits = factory(\App\Models\Service\RateUnit::class)
            ->times(5)
            ->create()
            ->map(function ($r) {
                return $r['id'];
            })
            ->toArray();

        print("Seeding services and service rates ...\n");
        factory(\App\Models\Service\Service::class)->times(10)->create()->each(function ($s) use ($kanton, $andere, $rateUnits) {

            $rateUnit = array_random($rateUnits);

            factory(\App\Models\Service\ServiceRate::class)->create([
                'rate_group_id' => $kanton,
                'service_id' => $s,
                'rate_unit_id' => $rateUnit
            ]);

            factory(\App\Models\Service\ServiceRate::class)->create([
                'rate_group_id' => $andere,
                'service_id' => $s,
                'rate_unit_id' => $rateUnit
            ]);
        });

        $customerTags = factory(App\Models\Customer\CustomerTag::class)->times(10)->create();

        print("Seeding companies ...\n");
        factory(\App\Models\Customer\Company::class)->times(10)->create([
            'rate_group_id' => \App\Models\Service\RateGroup::all()->random()->id
        ])->each(function ($c) use ($customerTags) {
            /** @var \App\Models\Customer\Company $c */
            $c->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            $c->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
            $c->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand(0, 2))->make());
        });

        print("Seeding people ...\n");
        factory(\App\Models\Customer\Person::class)->times(10)->create([
            'rate_group_id' => \App\Models\Service\RateGroup::all()->random()->id
        ])->each(function ($p) use ($customerTags) {
            /** @var \App\Models\Customer\Person $p */
            $p->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            $p->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
            $p->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand(0, 2))->make());
        });

        print("Fetching entites for later seeding steps ...\n");
        $employees = \App\Models\Employee\Employee::all();
        $addresses = \App\Models\Customer\Address::all();
        $people = \App\Models\Customer\Person::all();
        $companies = \App\Models\Customer\Company::all();
        $rateGroups = \App\Models\Service\RateGroup::all();

        print("Seeding offers ...\n");
        factory(\App\Models\Offer\Offer::class)->times(10)->create([
            'accountant_id' => $employees->random()->id,
            'address_id' => $addresses->random()->id,
            'customer_id' => $people->random()->id,
            'customer_type' => \App\Models\Customer\Person::class,
            'rate_group_id' => $rateGroups->random()->id
        ])->each(function ($o) {
            /** @var \App\Models\Offer\Offer $o */
            $o->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class)->times(rand(0, 2))->make());
            $o->discounts()->saveMany(factory(\App\Models\Offer\OfferDiscount::class)->times(rand(0, 2))->make());
        });

        factory(\App\Models\Offer\Offer::class)->times(10)->create([
            'accountant_id' => $employees->random()->id,
            'address_id' => $addresses->random()->id,
            'customer_id' => $companies->random()->id,
            'customer_type' => \App\Models\Customer\Company::class,
            'rate_group_id' => $rateGroups->random()->id
        ])->each(function ($o) {
            /** @var \App\Models\Offer\Offer $o */
            $o->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class)->times(rand(0, 2))->make());
            $o->discounts()->saveMany(factory(\App\Models\Offer\OfferDiscount::class)->times(rand(0, 2))->make());
        });

        print("Seeding project categories ...\n");
        $projectCategories = factory(\App\Models\Project\ProjectCategory::class)->times(10)->create();
    }
}

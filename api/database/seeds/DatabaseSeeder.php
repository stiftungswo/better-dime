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
        $kanton = factory(\App\Models\Service\RateGroup::class, 'kanton')->create();
        $andere = factory(\App\Models\Service\RateGroup::class, 'andere')->create();

        $rateUnits = factory(\App\Models\Service\RateUnit::class)
            ->times(5)
            ->create()
            ->map(function ($r) {
                return $r['id'];
            })
            ->toArray();

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

        factory(\App\Models\Customer\Company::class)->times(5)->create([
            'rate_group_id' => $kanton
        ])->each(function ($c) use ($customerTags) {
            /** @var \App\Models\Customer\Company $c */
            $c->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            $c->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
            $c->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand(0, 2))->make());
        });

        factory(\App\Models\Customer\Company::class)->times(5)->create([
            'rate_group_id' => $andere])->each(function ($c) use ($customerTags) {
            /** @var \App\Models\Customer\Company $c */
                $c->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
                $c->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
                $c->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand(0, 2))->make());
            });

        factory(\App\Models\Customer\Person::class)->times(5)->create([
            'rate_group_id' => $kanton
        ])->each(function ($p) use ($customerTags) {
            /** @var \App\Models\Customer\Person $p */
            $p->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
            $p->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
            $p->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand(0, 2))->make());
        });

        factory(\App\Models\Customer\Person::class)->times(5)->create([
            'rate_group_id' => $andere])->each(function ($p) use ($customerTags) {
            /** @var \App\Models\Customer\Person $p */
                $p->customer_tags()->attach($customerTags->random(rand(1, 3))->pluck('id')->toArray());
                $p->phone_numbers()->saveMany(factory(\App\Models\Customer\Phone::class)->times(rand(0, 2))->make());
                $p->addresses()->saveMany(factory(\App\Models\Customer\Address::class)->times(rand(0, 2))->make());
            });
    }
}

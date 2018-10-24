<?php

namespace Tests\Unit\Services;

use App\Models\Offer\Offer;
use App\Models\Offer\OfferDiscount;
use App\Models\Offer\OfferPosition;
use App\Services\CostBreakdown;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CostBreakdownTest extends \TestCase
{
    use DatabaseTransactions;

    public function testNoDiscounts()
    {
        $offer = $this->offerTemplate();
        $offer->discounts = [];

        $breakdown = CostBreakdown::calculate($offer);
        $this->assertEquals(52900, $breakdown['total']);
    }

    public function testMixedDiscounts()
    {
        // TODO Mit Dani diskutieren, ob der Wert 253.92 neu stimmt (anstatt 259.20 von seiner Implementation).
        // Theoretisch stimmt der neue Wert: 500 - (10 + (500 * 0.5)) = 240
        // 240 + (300 / 500 * 0.08 * 240) + (200 / 500 * 0.025 * 240) = 253.92
        // es kommt wohl daher, dass die alte Berechnung basierend darauf war, in welcher Reihenfolge die Discounts kamen
        $offer = $this->offerTemplate();
        $offer->discounts()->saveMany([
            $this->makeDiscount(['name' => 'Tenbucks', 'value' => 1000, 'percentage' => false]),
            $this->makeDiscount(['name' => 'Half', 'value' => 0.5, 'percentage' => true])]);

        $breakdown = CostBreakdown::calculate($offer);
        $this->assertEquals(25392, $breakdown['total']);
    }

    public function testFixedDiscount()
    {
        $offer = $this->offerTemplate();
        $offer->discounts()->save($this->makeDiscount(['name' => 'Tenbucks', 'value' => 1000, 'percentage' => false]));

        $breakdown = CostBreakdown::calculate($offer);
        $this->assertEquals(51842, $breakdown['total']);
    }

    public function testPercentageDiscount()
    {
        $offer = $this->offerTemplate();
        $offer->discounts()->save($this->makeDiscount(['name' => 'Half', 'value' => 0.5, 'percentage' => true]));

        $breakdown = CostBreakdown::calculate($offer);
        $this->assertEquals(26450, $breakdown['total']);
    }

    private function offerTemplate()
    {
        /** @var Offer $offer */
        $offer = factory(Offer::class)->create();
        $offer->positions()->saveMany([factory(OfferPosition::class)->make([
            'amount' => 1,
            'offer_id' => $offer->id,
            'price_per_rate' => 10000,
            'vat' => 0.08
        ]), factory(OfferPosition::class)->create([
            'amount' => 1,
            'offer_id' => $offer->id,
            'price_per_rate' => 20000,
            'vat' => 0.08
        ]), factory(OfferPosition::class)->create([
            'amount' => 1,
            'offer_id' => $offer->id,
            'price_per_rate' => 20000,
            'vat' => 0.025
        ])]);

        return $offer;
    }

    private function makeDiscount(array $params = [])
    {
        return factory(OfferDiscount::class)->make($params);
    }
}

<?php

namespace App\Services;

use App\Models\Offer\Offer;
use App\Models\Offer\OfferPosition;
use App\Models\Project\Project;
use App\Models\Project\ProjectPosition;

class CreateProjectFromOffer extends BaseBreakdown
{

    /**
     * @var Offer $offer ;
     */
    protected $offer;

    /**
     * @var array $offerBreakdown
     */
    protected $offerBreakdown;

    /**
     * @var Project $project
     */
    protected $project;

    public function __construct(Offer $offer)
    {
        $this->offer = $offer;
        $this->offerBreakdown = CostBreakdown::calculate($offer);
        $this->project = new Project();
    }

    /**
     * Creates a new project from an offer
     * @return Project
     */
    public function create()
    {
        $this->checkAndAssignProjectProperty('accountant_id');
        $this->checkAndAssignProjectProperty('address_id');
        $this->checkAndAssignProjectProperty('description', 'short_description');
        $this->checkAndAssignProjectProperty('name');
        $this->checkAndAssignProjectProperty('rate_group_id');

        $this->project->chargeable = true;

        if ($this->offer->fixed_price != null || $this->offer->fixed_price != 0) {
            $this->checkAndAssignProjectProperty('fixed_price');
        }

        $this->project->offer()->associate($this->offer);
        $this->project->save();

        foreach ($this->offer->positions as $offerPosition) {
            /** @var OfferPosition $offerPosition */
            // create project position
            $attributes = ['description', 'service_id', 'price_per_rate', 'rate_unit_id', 'vat'];
            $projectPosition = new ProjectPosition();

            foreach ($attributes as $attribute) {
                $projectPosition = $this->throwExceptionIfNull($offerPosition, $projectPosition, $attribute);
            }

            $this->project->positions()->save($projectPosition);
        }

        $this->project->save();

        return $this->project;
    }

    private function checkAndAssignProjectProperty(string $property, $oldPropertyName = null)
    {
        return $this->throwExceptionIfNull($this->offer, $this->project, $property, $oldPropertyName);
    }
}

<?php

namespace App\Services\Creator;

use App\Models\Offer\Offer;
use App\Models\Offer\OfferPosition;
use App\Models\Project\Project;
use App\Models\Project\ProjectPosition;

class CreateProjectFromOffer extends BaseCreator
{

    /**
     * @var Offer $offer ;
     */
    protected $offer;

    /**
     * @var Project $project
     */
    protected $project;

    public function __construct(Offer $offer)
    {
        $this->offer = $offer;
        $this->project = new Project();
    }

    /**
     * Creates a new project from an offer
     * @return Project
     */
    public function create()
    {
        $this->checkAndAssignProjectProperty('accountant_id');
        $this->checkAndAssignProjectProperty('customer_id');
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
            $attributes = ['service_id', 'price_per_rate', 'rate_unit_id', 'vat', 'order'];
            $projectPosition = new ProjectPosition();

            foreach ($attributes as $attribute) {
                $projectPosition = $this->assignOrThrowExceptionIfNull($offerPosition, $projectPosition, $attribute);
            }

            if ($offerPosition->description) {
                $projectPosition->description = $offerPosition->description;
            }

            if($offerPosition->position_group_id) {
                $projectPosition->position_group_id = $offerPosition->position_group_id;
            }

            $this->project->positions()->save($projectPosition);
        }

        $this->project->save();

        return $this->project;
    }

    private function checkAndAssignProjectProperty(string $property, $oldPropertyName = null)
    {
        return $this->assignOrThrowExceptionIfNull($this->offer, $this->project, $property, $oldPropertyName);
    }
}

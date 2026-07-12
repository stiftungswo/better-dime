# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCreator do
  describe ".create_project_from_offer" do
    let(:rate_group) { create(:rate_group) }
    let(:service) { create(:service) }
    let(:rate_unit) { create(:rate_unit) }
    let(:costgroup) { create(:costgroup) }
    let(:category) { create(:project_category) }
    let(:offer) { create(:offer, rate_group: rate_group) }

    context "when offer has costgroups and categories" do
      before do
        create(:offer_costgroup_distribution, offer: offer, costgroup: costgroup, weight: 100)
        create(:offer_category_distribution, offer: offer, project_category: category, weight: 100)
        create(:service_rate, service: service, rate_unit: rate_unit, rate_group: rate_group)
        create(:offer_position, offer: offer, service: service, rate_unit: rate_unit, vat: 0.077)
      end

      it "copies fields from the offer" do
        project = described_class.create_project_from_offer(offer, nil, nil)
        expect(project.name).to eq(offer.name)
        expect(project.customer).to eq(offer.customer)
        expect(project.accountant).to eq(offer.accountant)
        expect(project.address).to eq(offer.address)
        expect(project.rate_group).to eq(offer.rate_group)
        expect(project.offer).to eq(offer)
      end

      it "creates costgroup distributions from offer" do
        project = described_class.create_project_from_offer(offer, nil, nil)
        expect(project.project_costgroup_distributions.length).to eq(1)
        expect(project.project_costgroup_distributions.first.costgroup).to eq(costgroup)
      end

      it "creates category distributions from offer" do
        project = described_class.create_project_from_offer(offer, nil, nil)
        expect(project.project_category_distributions.length).to eq(1)
        expect(project.project_category_distributions.first.project_category).to eq(category)
      end

      it "creates positions from offer" do
        project = described_class.create_project_from_offer(offer, nil, nil)
        expect(project.project_positions.length).to eq(1)
        expect(project.project_positions.first.service).to eq(service)
      end
    end

    context "when offer has no costgroups (legacy fallback)" do
      it "creates costgroup from argument" do
        project = described_class.create_project_from_offer(offer, costgroup.number, category.id)
        expect(project.project_costgroup_distributions.length).to eq(1)
        expect(project.project_costgroup_distributions.first.costgroup).to eq(costgroup)
      end

      it "raises ValidationError when costgroup argument is nil" do
        expect do
          described_class.create_project_from_offer(offer, nil, category.id)
        end.to raise_error(ValidationError)
      end

      it "raises ValidationError when category argument is nil" do
        expect do
          described_class.create_project_from_offer(offer, costgroup.number, nil)
        end.to raise_error(ValidationError)
      end
    end
  end
end

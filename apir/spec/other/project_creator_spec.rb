# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCreator do
  it "creates a project from an offer" do
    offer = create(:offer)

    rate_unit_a = create(:rate_unit)
    rate_unit_b = create(:rate_unit, factor: 100, effort_unit: "dd")

    service_a = create(:service)
    service_b = create(:service, name: "The second service")

    service_rate_a = create(:service_rate, service: service_a, rate_unit: rate_unit_a)
    service_rate_b = create(:service_rate, service: service_b, rate_unit: rate_unit_b)

    position_a = create(:offer_position, offer: offer, service: service_a, rate_unit: rate_unit_a)
    position_b = create(:offer_position, offer: offer, service: service_b, rate_unit: rate_unit_b)

    created = described_class.create_project_from_offer(offer, 100, 10)

    expect(created.name).to eq(offer.name)
    expect(created.fixed_price).to eq(offer.fixed_price)
    expect(created.description).to eq(offer.short_description)
    expect(created.accountant).to eq(offer.accountant)
    expect(created.customer).to eq(offer.customer)
    expect(created.address).to eq(offer.address)
    expect(created.offer).to eq(offer)
    expect(created.rate_group).to eq(offer.rate_group)

    [position_a, position_b].each do |offer_position|
      has_project_position = created.project_positions.any? do |p_position|
        p_position.description = offer_position.description &&
                                 p_position.price_per_rate == offer_position.price_per_rate &&
                                 p_position.order == offer_position.order &&
                                 p_position.rate_unit == offer_position.rate_unit &&
                                 p_position.service == offer_position.service &&
                                 p_position.project == created &&
                                 p_position.position_group == offer_position.position_group &&
                                 p_position.vat == offer_position.vat
      end

      expect(has_project_position).to eq(true)
    end
  end
end

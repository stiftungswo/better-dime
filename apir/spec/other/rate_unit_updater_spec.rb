# frozen_string_literal: true

require "rails_helper"

RSpec.describe RateUnitUpdater do
  it "updates rate units" do
    rate_group = create(:rate_group)

    rate_unit_a = create(:rate_unit, name: "archived_unit", archived: true)
    rate_unit = create(:rate_unit, name: "non_archived_unit", archived: false)

    service = create(:service)

    service_rate_0 = create(:service_rate, service: service, rate_group: rate_group, rate_unit: rate_unit_a)
    service_rate_1 = create(:service_rate, service: service, rate_group: rate_group, rate_unit: rate_unit)

    # create a position with an archived rate unit
    position = create(:project_position, service: service, rate_unit: rate_unit_a)

    RateUnitUpdater.update_rate_units([position], rate_group)

    # expect the rate unit to have been updated to the non-archived one
    expect(position.rate_unit).to eq(rate_unit)
  end
end

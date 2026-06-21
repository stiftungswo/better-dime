# frozen_string_literal: true

require "rails_helper"

RSpec.describe RateUnitUpdater do
  describe ".update_rate_units" do
    let(:rate_group) { create(:rate_group) }
    let(:service) { create(:service) }
    let(:old_rate_unit) { create(:rate_unit, name: "Old", archived: true) }
    let(:new_rate_unit) { create(:rate_unit, name: "New", archived: false) }

    it "updates position to a non-archived rate unit matching the rate group" do
      create(:service_rate, service: service, rate_unit: new_rate_unit, rate_group: rate_group)
      position = build(:project_position, service: service, rate_unit: old_rate_unit)

      described_class.update_rate_units([position], rate_group)

      expect(position.rate_unit).to eq(new_rate_unit)
    end

    it "keeps the current rate unit when no matching service rate exists" do
      position = build(:project_position, service: service, rate_unit: old_rate_unit)

      described_class.update_rate_units([position], rate_group)

      expect(position.rate_unit).to eq(old_rate_unit)
    end

    it "skips archived service rates" do
      create(:service_rate, service: service, rate_unit: create(:rate_unit, archived: true), rate_group: rate_group)
      position = build(:project_position, service: service, rate_unit: old_rate_unit)

      described_class.update_rate_units([position], rate_group)

      expect(position.rate_unit).to eq(old_rate_unit)
    end
  end
end

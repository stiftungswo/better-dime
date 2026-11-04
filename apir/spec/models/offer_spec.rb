# frozen_string_literal: true

require "rails_helper"

RSpec.describe Offer, type: :model do
  it { is_expected.to validate_presence_of :accountant }
  it { is_expected.to validate_presence_of :customer }
  it { is_expected.to validate_presence_of :address }
  it { is_expected.to validate_presence_of :description }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :rate_group }
  it { is_expected.to validate_presence_of :short_description }
  it { is_expected.to validate_presence_of :status }

  it { is_expected.to validate_length_of(:name).is_at_most 255 }

  describe "#breakdown" do
    let(:offer) { create(:offer) }

    before do
      create_list(:offer_costgroup_distribution, 3, offer: offer)
      create(:offer_position, offer: offer, amount: 10, price_per_rate: 1000, vat: 0.077, rate_unit: create(:rate_unit, factor: 1))
    end

    it "splits the net amount over three cost groups without losing Rappen" do
      breakdown = offer.reload.breakdown
      rows = breakdown[:vats_by_costgroup].values.flatten

      expect(rows.sum { |row| row[:subtotal] }).to eq(breakdown[:raw_total])
      expect(rows.sum { |row| row[:value] }).to eq(breakdown[:vat_total])
    end
  end
end

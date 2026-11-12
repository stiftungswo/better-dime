# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvoiceCostgroupDistribution, type: :model do
  it { is_expected.to validate_presence_of :costgroup }
  it { is_expected.to validate_presence_of :weight }
  it { is_expected.to validate_presence_of :invoice }
  it { is_expected.to validate_numericality_of(:weight).is_greater_than_or_equal_to 0 }

  describe "#weight_percent" do
    it "is 0 instead of NaN when all weights of the invoice are 0" do
      distribution = build_stubbed(:invoice_costgroup_distribution, weight: 0)
      allow(distribution.invoice).to receive(:invoice_costgroup_distributions).and_return([distribution])

      expect(distribution.weight_percent).to eq(0.0)
    end
  end
end

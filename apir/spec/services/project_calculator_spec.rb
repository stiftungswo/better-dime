# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCalculator do
  let(:rate_group) { create(:rate_group) }
  let(:service) { create(:service) }
  let(:rate_unit) { create(:rate_unit, factor: 60, is_time: true) }
  let(:costgroup) { create(:costgroup) }
  let(:project) { create(:project, rate_group: rate_group) }

  before do
    create(:project_costgroup_distribution, project: project, costgroup: costgroup, weight: 100)
  end

  describe "#budget_price" do
    it "returns nil when project has no offer" do
      project_no_offer = create(:project, offer: nil)
      calc = described_class.new(project_no_offer)
      expect(calc.budget_price).to be_nil
    end

    it "returns fixed_price when offer has one" do
      offer = create(:offer, :with_fixed_price, rate_group: rate_group)
      project_fp = create(:project, offer: offer, rate_group: rate_group)
      calc = described_class.new(project_fp)
      expect(calc.budget_price).to eq(offer.fixed_price)
    end

    it "calculates cost breakdown total when offer has no fixed price" do
      calc = described_class.new(project)
      expect(calc.budget_price).to be_a(Numeric)
    end
  end

  describe "#budget_time" do
    it "returns nil when project has no offer" do
      project_no_offer = create(:project, offer: nil)
      calc = described_class.new(project_no_offer)
      expect(calc.budget_time).to be_nil
    end

    it "sums estimated work hours from offer positions" do
      offer = project.offer
      create(:offer_position, offer: offer, service: service, rate_unit: rate_unit, amount: 10)
      calc = described_class.new(project)
      expect(calc.budget_time).to eq(10 * rate_unit.factor)
    end
  end

  describe "#current_price" do
    it "sums charge from all project positions" do
      position = create(:project_position, project: project, service: service, rate_unit: rate_unit, price_per_rate: 10_000)
      create(:project_effort, project_position: position, value: 60, date: Date.today, costgroup: costgroup)

      calc = described_class.new(project)
      expect(calc.current_price).to be > 0
    end

    it "returns 0 when project has no positions" do
      calc = described_class.new(project)
      expect(calc.current_price).to eq(0)
    end
  end

  describe "#current_time" do
    it "sums effort values for time-based rate units" do
      position = create(:project_position, project: project, service: service, rate_unit: rate_unit, price_per_rate: 10_000)
      create(:project_effort, project_position: position, value: 120, date: Date.today, costgroup: costgroup)

      calc = described_class.new(project)
      expect(calc.current_time).to eq(120.0)
    end

    it "ignores non-time rate units" do
      non_time_unit = create(:rate_unit, is_time: false, factor: 1)
      position = create(:project_position, project: project, service: service, rate_unit: non_time_unit, price_per_rate: 10_000)
      create(:project_effort, project_position: position, value: 100, date: Date.today, costgroup: costgroup)

      calc = described_class.new(project)
      expect(calc.current_time).to eq(0)
    end
  end

  describe ".days_since_last_invoice" do
    it "returns nil when dates are missing" do
      expect(described_class.days_since_last_invoice(double(last_effort_date: nil, last_invoice_date: Date.today))).to be_nil
    end
  end
end

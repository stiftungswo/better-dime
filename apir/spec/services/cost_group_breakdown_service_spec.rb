# frozen_string_literal: true

require "rails_helper"

RSpec.describe CostGroupBreakdownService do
  let(:project) { create(:project) }
  let(:costgroup_a) { create(:costgroup) }
  let(:costgroup_b) { create(:costgroup) }
  let(:rate_unit) { create(:rate_unit, factor: 1) }
  let(:service) { create(:service) }

  before do
    position = create(:project_position, project: project, rate_unit: rate_unit, service: service, price_per_rate: 10_000)
    create(:project_effort, project_position: position, costgroup: costgroup_a, value: 100, date: "2026-01-15")
    create(:project_effort, project_position: position, costgroup: costgroup_b, value: 50, date: "2026-01-20")
  end

  describe "#costgroup_sums" do
    it "groups effort prices by costgroup number" do
      svc = described_class.new(project)
      sums = svc.costgroup_sums

      expect(sums.keys).to contain_exactly(costgroup_a.number, costgroup_b.number)
    end
  end

  describe "#costgroup_distribution" do
    it "returns percentage of total for a costgroup" do
      svc = described_class.new(project)
      dist_a = svc.costgroup_distribution(costgroup_a.number)
      dist_b = svc.costgroup_distribution(costgroup_b.number)

      expect(dist_a + dist_b).to be_within(0.01).of(100.0)
    end

    it "returns 0 for an unknown costgroup" do
      svc = described_class.new(project)
      expect(svc.costgroup_distribution(99_999)).to eq(0.0)
    end
  end

  describe "#costgroup_dist_incomplete?" do
    it "returns false when all efforts have costgroups" do
      svc = described_class.new(project)
      expect(svc.costgroup_dist_incomplete?).to be false
    end
  end

  describe "with date range filter" do
    it "only includes efforts within the range" do
      svc = described_class.new(project, Date.new(2026, 1, 10)..Date.new(2026, 1, 16))
      expect(svc.costgroup_sums.keys).to contain_exactly(costgroup_a.number)
    end
  end
end

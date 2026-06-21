# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectServiceCostReportService do
  let(:rate_unit) { create(:rate_unit, factor: 60, is_time: true) }
  let(:service_a) { create(:service, name: "Development") }
  let(:service_b) { create(:service, name: "Design") }
  let(:project) { create(:project) }
  let(:costgroup) { create(:costgroup) }

  before do
    pos_a = create(:project_position, project: project, service: service_a, rate_unit: rate_unit, price_per_rate: 15_000, vat: 0.077)
    pos_b = create(:project_position, project: project, service: service_b, rate_unit: rate_unit, price_per_rate: 12_000, vat: 0.077)
    create(:project_effort, project_position: pos_a, value: 120, date: Date.new(2026, 3, 10), costgroup: costgroup)
    create(:project_effort, project_position: pos_b, value: 60, date: Date.new(2026, 3, 15), costgroup: costgroup)
  end

  let(:range) { Date.new(2026, 1, 1)..Date.new(2026, 12, 31) }

  describe "#initialize" do
    it "raises on non-integer service IDs" do
      expect { described_class.new(range, ["abc"]) }.to raise_error(StandardError, "Non-integer service IDs.")
    end

    it "accepts valid service IDs" do
      expect { described_class.new(range, [service_a.id.to_s]) }.not_to raise_error
    end

    it "accepts empty service filter" do
      expect { described_class.new(range, []) }.not_to raise_error
    end
  end

  describe "#to_francs" do
    it "converts centimes to francs" do
      svc = described_class.new(range)
      expect(svc.to_francs(15_000)).to eq(150.0)
    end
  end

  describe "#table" do
    it "returns header, data rows, and footers" do
      svc = described_class.new(range)
      table = svc.table

      expect(table.first).to include("Projekt ID", "Projekt")
      expect(table.length).to be >= 3
    end
  end

  describe "#header" do
    it "includes service names" do
      svc = described_class.new(range)
      expect(svc.header).to include("Development")
      expect(svc.header).to include("Design")
    end
  end

  describe "#rows" do
    it "includes project data" do
      svc = described_class.new(range)
      rows = svc.rows
      expect(rows.length).to eq(1)
      expect(rows.first).to include(project.id)
    end
  end

  describe "with_vat" do
    it "changes footer text" do
      svc_no_vat = described_class.new(range, [], false)
      svc_vat = described_class.new(range, [], true)
      expect(svc_no_vat.footers.last).to include(a_string_matching(/ohne/))
      expect(svc_vat.footers.last).to include(a_string_matching(/mit/))
    end
  end

  describe "with service filter" do
    it "only includes filtered service" do
      svc = described_class.new(range, [service_a.id.to_s])
      expect(svc.services.pluck(:id)).to contain_exactly(service_a.id)
    end
  end
end

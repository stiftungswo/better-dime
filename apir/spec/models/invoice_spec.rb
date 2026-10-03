# frozen_string_literal: true

require "rails_helper"

RSpec.describe Invoice, type: :model do
  it { is_expected.to validate_presence_of :accountant }
  it { is_expected.to validate_presence_of :address }
  it { is_expected.to validate_presence_of :description }
  it { is_expected.to validate_presence_of :beginning }
  it { is_expected.to validate_presence_of :ending }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_numericality_of(:fixed_price).only_integer }
  it { is_expected.to validate_numericality_of(:fixed_price_vat).is_greater_than_or_equal_to 0 }

  it_behaves_like "ending is after beginning"

  describe "#beginning" do
    it_behaves_like "only accepts dates", :beginning
  end

  describe "#ending" do
    it_behaves_like "only accepts dates", :ending
  end

  describe "#final_cost_group_distribution" do
    let(:invoice) { create(:invoice, beginning: "2026-01-01", ending: "2026-01-31") }
    let(:invoiced_costgroup) { create(:costgroup) }
    let(:other_costgroup) { create(:costgroup) }
    let(:project_position) do
      create(:project_position, project: invoice.project, rate_unit: create(:rate_unit, factor: 1), price_per_rate: 10_000)
    end

    before do
      create(:project_effort, project_position: project_position, costgroup: invoiced_costgroup, value: 1, date: "2026-01-10")
      create(:project_effort, project_position: project_position, costgroup: other_costgroup, value: 3, date: "2026-01-11")
    end

    context "when the invoice has its own cost group distribution" do
      before { create(:invoice_costgroup_distribution, invoice: invoice, costgroup: invoiced_costgroup, weight: 100) }

      it "uses only the invoice's cost groups, even if the project has efforts on others" do
        expect(invoice.final_cost_group_distribution).to eq(invoiced_costgroup.number => 100.0)
      end

      it "never lets the weights exceed 100%" do
        expect(invoice.final_cost_group_distribution.values.sum).to eq(100.0)
      end

      it "does not inflate the per-cost-group subtotal and VAT of the breakdown" do
        create(:invoice_position, invoice: invoice, price_per_rate: 8370, amount: 1, vat: 0.081)
        vats = invoice.reload.breakdown[:vats_by_costgroup]

        expect(vats.values.flatten.pluck(:cg)).to eq([invoiced_costgroup.number])
        expect(vats["0.081"].first).to include(subtotal: 8370.0, value: 677)
      end
    end

    context "when the invoice has no own distribution" do
      it "falls back to the percentages computed from the project efforts" do
        expect(invoice.final_cost_group_distribution).to eq(
          invoiced_costgroup.number => 25.0,
          other_costgroup.number => 75.0
        )
      end
    end

    context "when some efforts have no cost group" do
      it "ignores the unassigned efforts in the fallback" do
        allow(invoice.cost_group_breakdown).to receive(:costgroup_sums).and_return(nil => 10, invoiced_costgroup.number => 10)

        expect(invoice.final_cost_group_distribution.keys).to eq([invoiced_costgroup.number])
      end
    end
  end

  # this applies to all text fields as it is defined in ApplicationRecord
  it "normalizes unicode fields" do
    invoice = described_class.new
    invoice.description = "a\u0308 o\u0308 u\u0308" # create äöü with the combining diaresis
    invoice.validate
    expect(invoice.description).to eq("ä ö ü")
  end
end

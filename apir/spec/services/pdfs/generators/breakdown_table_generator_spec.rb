# frozen_string_literal: true

require "rails_helper"

RSpec.describe Pdfs::Generators::BreakdownTableGenerator do
  let(:document) { instance_double(Prawn::Document, bounds: instance_double(Prawn::Document::BoundingBox, width: 500)).as_null_object }
  let(:rendered_rows) { [] }
  let(:table_generator) do
    instance_double(Pdfs::Generators::TableGenerator).tap do |table|
      allow(table).to receive(:render) { |rows, *| rendered_rows.concat(rows.pluck(:data)) }
    end
  end
  let(:position_class) { Struct.new(:calculated_total, :vat, :order, :position_group_id, :amount) }

  before do
    allow(Pdfs::Generators::TableGenerator).to receive(:new).and_return(table_generator)
  end

  def printed(label)
    rendered_rows.find { |row| row.first == label }&.last
  end

  def render_amounts(breakdown)
    generator = described_class.new(document, breakdown)
    generator.send(:render_subtotal)
    generator.send(:render_total)
  end

  describe "fixed price invoices" do
    it "prints amounts that add up to the total" do
      # 12'343 Rappen / 1.077 = 11'460.53 Rappen excl. VAT, the payable total is rounded up to 12'345
      render_amounts(CostBreakdown.new([], [], {}, [], 12_343, 0.077).calculate)

      expect(printed(I18n.t(:fix_price_excl_vat))).to eq("114.61")
      expect(printed(I18n.t(:total_vat))).to eq("8.82")
      expect(printed(I18n.t(:rounding))).to eq("0.02")
      expect(printed(I18n.t(:fix_price_total))).to eq("123.45")
    end

    it "does not print a rounding line when nothing was rounded" do
      render_amounts(CostBreakdown.new([], [], {}, [], 12_345, 0.077).calculate)

      expect(printed(I18n.t(:rounding))).to be_nil
    end
  end

  describe "invoices without fixed price" do
    it "prints VAT and rounding so that net + VAT + rounding equals the total" do
      # 10.05 net, VAT 77.385 Rappen -> 0.77, exact total 10.82, payable total 10.80
      position = position_class.new(1005, 0.077, 0, nil, 1.0)
      render_amounts(CostBreakdown.new([position], [], { 100 => 100.0 }, [], nil, 0.077).calculate)

      expect(printed(I18n.t(:subtotal_excl_vat))).to eq("10.05")
      expect(printed(I18n.t(:total_vat))).to eq("0.77")
      expect(printed(I18n.t(:rounding))).to eq("-0.02")
      expect(printed(I18n.t(:total))).to eq("10.80")
    end
  end

  describe "discounts" do
    # -102 Rappen is applied as -105 (floored to 5), so that is what has to be printed as well.
    let(:breakdown) do
      { fixed_price: nil, discounts: [{ name: "Early payment", value: -102 }], discount_total: -105, raw_total: 10_000 }
    end

    it "prints the discount line as the amount that is actually applied" do
      described_class.new(document, breakdown).send(:render_subtotal)

      expect(printed("Early payment")).to eq("-1.05")
      expect(printed(I18n.t(:total_discount).capitalize)).to eq("-1.05")
    end
  end
end

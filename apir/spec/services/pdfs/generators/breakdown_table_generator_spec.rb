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

  before do
    allow(Pdfs::Generators::TableGenerator).to receive(:new).and_return(table_generator)
  end

  def printed(label)
    rendered_rows.find { |row| row.first == label }&.last
  end

  describe "fixed price invoices" do
    # 12'345 Rappen / 1.077 = 11'462.39 Rappen excl. VAT. Rounding the VAT (882.61) on its own would print
    # 114.60 + 8.80 = 123.40 against a total of 123.45.
    let(:breakdown) do
      { fixed_price: 12_345, fixed_price_vat: 0.077, discounts: [], total: 12_345, vat_total: 0 }
    end

    it "prints amounts that add up to the total" do
      generator = described_class.new(document, breakdown)
      generator.send(:render_subtotal)
      generator.send(:render_total)

      excl_vat = printed(I18n.t(:fix_price_excl_vat))
      vat = printed(I18n.t(:total_vat))
      total = printed(I18n.t(:fix_price_total))

      expect([excl_vat, vat, total]).to eq(["114.60", "8.85", "123.45"])
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

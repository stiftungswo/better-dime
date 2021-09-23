# frozen_string_literal: true

require "rails_helper"

RSpec.describe CostBreakdown do
  it "breaks down the costs correctly without fix price" do
    invoice = create(:invoice)

    group_a = create(:position_group, name: "Group A")
    group_b = create(:position_group, name: "Group B")

    position_a = create(:invoice_position, invoice: invoice, vat: 0.077, price_per_rate: 5235, amount: 13.31, position_group: nil)
    position_b = create(:invoice_position, invoice: invoice, vat: 0.077, price_per_rate: 4312, amount: 3.145, position_group: nil)
    position_c = create(:invoice_position, invoice: invoice, vat: 0.025, price_per_rate: 222, amount: 6, position_group: group_a)
    position_d = create(:invoice_position, invoice: invoice, vat: 0.025, price_per_rate: 11, amount: 513, position_group: group_a)
    position_e = create(:invoice_position, invoice: invoice, vat: 0.077, price_per_rate: 9411, amount: 12.22, position_group: group_b)

    discount_a = create(:invoice_discount, invoice: invoice, percentage: false, value: 151.1)
    discount_b = create(:invoice_discount, invoice: invoice, percentage: true, value: 0.03156)

    breakdown = described_class.new(invoice.invoice_positions, invoice.invoice_discounts, invoice.position_groupings, invoice.fixed_price, invoice.fixed_price_vat || 0.077).calculate

    expected = {
      discount_total: -6640,
      discounts: [
        { name: "My InvoiceDiscount", value: -151 },
        { name: "My InvoiceDiscount (3.16%)", value: -6484 }
      ],
      final_total: 213_515.0,
      fixed_price: nil,
      fixed_price_vat: 0.077,
      raw_total: 198_575.0,
      subtotal: 205_215.0,
      total: 213_515.0,
      vat_total: 14_940,
      vats: [
        { factor: 0.9660112564870988, value: 14_770, vat: "0.077" },
        { factor: 0.033988743512901105, value: 168, vat: "0.025" }
      ]
    }

    expect(breakdown.except(:grouped_positions)).to eq(expected)
  end

  it "breaks down the costs correctly with fix price" do
    invoice = create(:invoice, :with_fixed_price)

    group_a = create(:position_group, name: "Group A")
    group_b = create(:position_group, name: "Group B")

    position_a = create(:invoice_position, invoice: invoice, vat: 0.077, price_per_rate: 5235, amount: 13.31, position_group: nil)
    position_b = create(:invoice_position, invoice: invoice, vat: 0.077, price_per_rate: 4312, amount: 3.145, position_group: nil)
    position_c = create(:invoice_position, invoice: invoice, vat: 0.025, price_per_rate: 222, amount: 6, position_group: group_a)
    position_d = create(:invoice_position, invoice: invoice, vat: 0.025, price_per_rate: 11, amount: 513, position_group: group_a)
    position_e = create(:invoice_position, invoice: invoice, vat: 0.077, price_per_rate: 9411, amount: 12.22, position_group: group_b)

    discount_a = create(:invoice_discount, invoice: invoice, percentage: false, value: 151.1)
    discount_b = create(:invoice_discount, invoice: invoice, percentage: true, value: 0.03156)

    breakdown = described_class.new(invoice.invoice_positions, invoice.invoice_discounts, invoice.position_groupings, invoice.fixed_price, 0.077).calculate

    expected = {
      discount_total: -6640,
      discounts: [
        { name: "My InvoiceDiscount", value: -151 },
        { name: "My InvoiceDiscount (3.16%)", value: -6484 }
      ],
      final_total: 12_000,
      fixed_price: 12_000,
      fixed_price_vat: 0.077,
      raw_total: 198_575.0,
      subtotal: 205_215.0,
      total: 213_515.0,
      vat_total: 14_940,
      vats: [
        { factor: 0.9660112564870988, value: 14_770, vat: "0.077" },
        { factor: 0.033988743512901105, value: 168, vat: "0.025" }
      ]
    }

    expect(breakdown.except(:grouped_positions)).to eq(expected)
  end
end

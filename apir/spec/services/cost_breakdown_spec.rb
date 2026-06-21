# frozen_string_literal: true

require "rails_helper"

RSpec.describe CostBreakdown do
  let(:rate_unit) { create(:rate_unit, factor: 1) }
  let(:position_group) { create(:position_group) }

  def make_position(amount:, price_per_rate:, vat: 0.077, group: nil, order: 1)
    create(:invoice_position,
           amount: amount,
           price_per_rate: price_per_rate,
           vat: vat,
           position_group: group || position_group,
           rate_unit: rate_unit,
           order: order)
  end

  describe "#calculate" do
    it "returns all expected keys" do
      result = described_class.new([], [], {}, [], nil, nil).calculate
      expect(result).to include(
        :discounts, :discount_total, :grouped_positions, :subtotal,
        :raw_total, :total, :vats_by_costgroup, :vat_total,
        :fixed_price, :fixed_price_vat, :final_total
      )
    end

    context "with positions" do
      let(:positions) { [make_position(amount: 10, price_per_rate: 1000)] }
      let(:costgroups) { { 100 => 100 } }

      it "calculates subtotal from positions" do
        result = described_class.new(positions, [], costgroups, [], nil, nil).calculate
        expect(result[:subtotal]).to eq(10_000)
      end

      it "calculates VAT" do
        result = described_class.new(positions, [], costgroups, [], nil, nil).calculate
        expect(result[:vat_total]).to be > 0
      end

      it "applies final_total as fixed_price when present" do
        result = described_class.new(positions, [], costgroups, [], 50_000, 0.077).calculate
        expect(result[:final_total]).to eq(50_000)
      end

      it "uses calculated total when no fixed price" do
        result = described_class.new(positions, [], costgroups, [], nil, nil).calculate
        expect(result[:final_total]).to eq(result[:total])
      end
    end

    context "with fixed discount" do
      let(:positions) { [make_position(amount: 10, price_per_rate: 1000)] }
      let(:discount) { create(:invoice_discount, value: 500, percentage: false) }

      it "applies fixed discount" do
        result = described_class.new(positions, [discount], {}, [], nil, nil).calculate
        expect(result[:discount_total]).to eq(-500)
      end
    end

    context "with percentage discount" do
      let(:positions) { [make_position(amount: 10, price_per_rate: 1000)] }
      let(:discount) { create(:invoice_discount, :with_percentage) }

      it "applies percentage discount" do
        result = described_class.new(positions, [discount], {}, [], nil, nil).calculate
        expect(result[:discount_total]).to be < 0
      end
    end

    context "with position groups" do
      it "groups positions by their position group" do
        group_a = create(:position_group, name: "A", order: 1)
        group_b = create(:position_group, name: "B", order: 2)
        pos_a = make_position(amount: 5, price_per_rate: 100, group: group_a)
        pos_b = make_position(amount: 3, price_per_rate: 200, group: group_b)

        result = described_class.new([pos_a, pos_b], [], {}, [group_a, group_b], nil, nil).calculate
        group_names = result[:grouped_positions].pluck(:group_name)
        expect(group_names).to include("A", "B")
      end

      it "excludes groups with no positions that have positive amounts" do
        group = create(:position_group, name: "Empty")
        pos = make_position(amount: 0, price_per_rate: 100, group: group)

        result = described_class.new([pos], [], {}, [group], nil, nil).calculate
        expect(result[:grouped_positions]).to be_empty
      end
    end

    context "with multiple VAT rates" do
      it "distributes VAT across costgroups" do
        pos_a = make_position(amount: 10, price_per_rate: 1000, vat: 0.077)
        pos_b = make_position(amount: 5, price_per_rate: 2000, vat: 0.025)
        costgroups = { 100 => 60, 200 => 40 }

        result = described_class.new([pos_a, pos_b], [], costgroups, [], nil, nil).calculate
        expect(result[:vats_by_costgroup].keys.length).to eq(2)
      end
    end
  end
end

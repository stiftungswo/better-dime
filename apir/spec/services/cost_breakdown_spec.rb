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

    describe "reconciliation of the printed amounts" do
      let(:position_class) { Struct.new(:calculated_total, :vat, :order, :position_group_id, :amount) }
      let(:discount_class) { Struct.new(:name, :value, :percentage) }
      let(:costgroups) { { 100 => 60.0, 200 => 25.0, 300 => 15.0 } }

      def position(total, vat, order = 0)
        position_class.new(total, vat, order, nil, 1.0)
      end

      def random_breakdown(random)
        positions = Array.new(random.rand(1..6)) do |i|
          position(random.rand(-5_000..500_000) + random.rand.round(2), [0.077, 0.081, 0.026, 0.0].sample(random: random), i)
        end
        discounts = random.rand < 0.5 ? [discount_class.new("discount", [0.05, 0.1].sample(random: random), true)] : []
        [positions, described_class.new(positions, discounts, costgroups, [], nil, nil).calculate]
      end

      it "makes net + VAT + rounding equal the payable total and every row add up to its total" do
        random = Random.new(42)

        500.times do
          _positions, result = random_breakdown(random)
          rows = result[:vats_by_costgroup].values.flatten

          expect(result[:raw_total] + result[:vat_total] + result[:rounding]).to eq((result[:total] / 5.0).round * 5)
          expect(rows.sum { |row| row[:subtotal] }).to eq(result[:raw_total])
          expect(rows.sum { |row| row[:value] }).to eq(result[:vat_total])
        end
      end

      it "calculates the VAT of every rate on that rate's net amount, rounded half up to the Rappen" do
        random = Random.new(7)

        200.times do
          _positions, result = random_breakdown(random)

          result[:vats_by_costgroup].each do |rate, rows|
            expect(rows.sum { |row| row[:value] }).to eq((rows.sum { |row| row[:subtotal] } * rate.to_r).round)
          end
        end
      end

      it "does not lose VAT to truncation" do
        result = described_class.new([position(1005, 0.077)], [], { 100 => 100.0 }, [], nil, nil).calculate

        # 1005 * 7.7% = 77.385 Rappen
        expect(result).to include(raw_total: 1005, vat_total: 77, total: 1082, rounding: -2)
      end

      it "splits an amount that is left over when the VAT rate shares cancel out" do
        positions = [position(1000, 0.077, 0), position(-1000, 0.0, 1)]
        discounts = [discount_class.new("fixed", 100, false)]
        result = described_class.new(positions, discounts, { 100 => 100.0 }, [], nil, nil).calculate
        rows = result[:vats_by_costgroup].values.flatten

        expect(result[:raw_total]).to eq(-100)
        expect(rows.sum { |row| row[:subtotal] }).to eq(-100)
      end

      it "splits a fixed price exactly and keeps the difference to the payable total as rounding" do
        result = described_class.new([], [], {}, [], 12_343, 0.077).calculate

        # 12'343 / 1.077 = 11'460.53
        expect(result).to include(fixed_price_excl_vat: 11_461, vat_total: 882, total: 12_343, rounding: 2, final_total: 12_343)
      end

      it "ignores a fixed price that is not positive" do
        [0, -500].each do |fixed_price|
          result = described_class.new([position(10_000, 0.077)], [], costgroups, [], fixed_price, 0.077).calculate

          expect(result).to include(fixed_price: nil, final_total: result[:total])
          expect(result[:final_total]).to eq(10_000 + 770)
        end
      end
    end
  end
end

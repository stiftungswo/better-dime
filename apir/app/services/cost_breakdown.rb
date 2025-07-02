# frozen_string_literal: true

class CostBreakdown
  def initialize(positions, discounts, costgroups, position_groupings, fixed_price, fixed_price_vat)
    @positions = positions
    @discounts = discounts
    @costgroups = costgroups
    @position_groupings = position_groupings
    @fixed_price = fixed_price
    @fixed_price_vat = fixed_price_vat
  end

  def calculate
    positions = @positions.sort_by { |p| p.order.to_i }
    subtotal = calculate_subtotal positions
    discounts = @discounts.map { |discount| apply_discount subtotal, discount }
    discounts_total = discounts.inject(0) { |sum, d| sum + ((d[:value] / 5.0).floor * 5) }
    total_with_discounts = subtotal + discounts_total
    vats_by_costgroup = calculate_vats_by_costgroup positions, total_with_discounts
    vats_total = calculate_vat_total positions, total_with_discounts
    total = total_with_discounts + vats_total
    grouped_positions = get_grouped_positions @positions, @position_groupings

    {
      discounts: discounts,
      discount_total: discounts_total,
      grouped_positions: grouped_positions,
      subtotal: subtotal,
      raw_total: total_with_discounts,
      total: total,
      vats_by_costgroup: vats_by_costgroup,
      vat_total: vats_total,
      fixed_price: @fixed_price,
      fixed_price_vat: @fixed_price_vat,
      final_total: @fixed_price || total
    }
  end

  # return the list of groups with their respective positions
  def get_grouped_positions(positions, groups)
    default_positions = positions.select { |p| p.position_group_id.nil? && p.amount.positive? }
    default_group = [{
      group_name: "",
      order: 0,
      positions: default_positions,
      subtotal: calculate_subtotal(default_positions)
    }]

    grouped_positions = groups.map do |group|
      filtered_positions = positions.select { |p| p.position_group_id == group.id && p.amount.positive? }

      {
        group_name: group.name,
        order: (group.order or 0),
        positions: filtered_positions,
        subtotal: calculate_subtotal(filtered_positions)
      }
    end

    grouped_positions.concat(default_group).sort_by { |group| [group[:order], group[:group_name]] }.reject do |group|
      group[:positions].empty?
    end
  end

  def calculate_subtotal(positions)
    positions.inject(0) { |sum, p| sum + ((p.calculated_total / 5.0).round * 5.0) }
  end

  def calculate_vats_by_costgroup(positions, total_with_discounts)
    vat_costgroups = {}
    used_total = 0

    calculate_vat_distribution(positions).each do |vat, details|
      vat_costgroups[vat] = @costgroups.map do |cg_id, percentage|
        {
          cg: cg_id,
          subtotal: details[:subtotal] * (percentage / 100.0),
          factor: details[:factor],
          value: round_vat_to_fit(total_with_discounts, used_total, vat, details[:factor], percentage / 100.0)
        }
      end
    end

    vat_costgroups
  end

  def round_vat_to_fit(total_with_discounts, _used_total, vat, factor, cg_percentage)
    (total_with_discounts.to_i * vat.to_f * factor * cg_percentage).to_i
  end

  def calculate_vat_total(positions, total_with_discounts)
    calculate_vat_distribution(positions).reduce(0) do |vat, details|
      (total_with_discounts.to_i * vat.to_f * details[:factor]).to_i
    end
  end

  def vat_distributions(positions)
    @vat_distributions ||= calculate_vat_distribution positions
  end

  def calculate_vat_distribution(positions)
    vat_groups = group_by_vat positions
    vat_subtotals = vat_groups.transform_values { |vat_positions| calculate_subtotal(vat_positions) }
    vat_total = vat_subtotals.inject(0) { |sum, (_vat, vat_subtotal)| sum + vat_subtotal }
    # calculate the vat distribution by dividing each subtotal by the total
    vat_subtotals.transform_values { |subtotal| { factor: vat_total.zero? ? 0 : subtotal / vat_total, subtotal: subtotal } }
  end

  def group_by_vat(positions)
    positions.map { |p| p.vat.round(4).to_s }.uniq.index_with { |vat_key| positions.select { |p| p.vat.round(4).to_s == vat_key } }
  end

  def apply_discount(subtotal, discount)
    discount.percentage ? apply_discount_factor(subtotal, discount) : apply_discount_fixed(discount)
  end

  def apply_discount_factor(subtotal, discount)
    { name: "#{discount.name} (#{discount.value * 100}%)", value: (subtotal * discount.value * -1).to_i }
  end

  def apply_discount_fixed(discount)
    { name: discount.name.to_s, value: (discount.value * -1).to_i }
  end
end

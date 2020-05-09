# frozen_string_literal: true

class CostBreakdown
  def initialize(positions, discounts, position_groupings, fixed_price)
    @positions = positions
    @discounts = discounts
    @position_groupings = position_groupings
    @fixed_price = fixed_price
  end

  def calculate
    positions = @positions.sort_by {|p| p.order.to_i}
    subtotal = calculate_subtotal positions
    discounts = @discounts.map { |discount| apply_discount subtotal, discount }
    discounts_total = discounts.inject(0) { |sum, d| sum + (d[:value]/5.0).floor * 5 }
    total_with_discounts = subtotal + discounts_total
    vats = calculate_vats positions, total_with_discounts
    vats_total = vats.inject(0) { |sum, v| sum + (v[:value]/5.0).round * 5 }
    total = total_with_discounts + vats_total
    grouped_positions = get_grouped_positions @positions, @position_groupings

    fixed_price_vats = []
    fixed_price_vats_sum = 0.0

    if @fixed_price
      vats.each do |vat|
        ratio = vat[:value].to_f * (1.0 / vat[:vat].to_f) / subtotal
        fixed_price_times_ratio = @fixed_price.to_f * ratio
        fixed_price_vats_val = (fixed_price_times_ratio - (fixed_price_times_ratio / (1 + vat[:vat].to_f))).round
        fixed_price_vats_sum += fixed_price_vats_val

        fixed_price_vats.push(
          vat: vat[:vat],
          value: fixed_price_vats_val.to_s
        )
      end
    end

    {
      discounts: discounts,
      discount_total: discounts_total,
      grouped_positions: grouped_positions,
      subtotal: subtotal,
      raw_total: total_with_discounts,
      total: total,
      vats: vats,
      vat_total: vats_total,
      fixed_price: @fixed_price,
      fixed_price_vats: fixed_price_vats,
      fixed_price_vats_sum: fixed_price_vats_sum,
      final_total: @fixed_price || total
    }
  end

  # return the list of groups with their respective positions
  def get_grouped_positions(positions, groups)
    default_positions = positions.select { |p| p.position_group_id.nil? }
    default_group = [{
      group_name: (I18n.t :general_group_name),
      positions: default_positions,
      subtotal: calculate_subtotal(default_positions)
    }]

    grouped_positions = groups.map do |group|
      filtered_positions = positions.select { |p| p.position_group_id == group.id }

      {
        group_name: group.name,
        positions: filtered_positions,
        subtotal: calculate_subtotal(filtered_positions)
      }
    end

    grouped_positions.concat(default_group).sort_by { |group| group[:group_name] }.select do |group|
      group[:positions].length > 0
    end
  end

  def calculate_subtotal(positions)
    positions.inject(0) { |sum, p| sum + (p.calculated_total/5.0).round * 5.0 }
  end

  def calculate_vats(positions, total_with_discounts)
    vat_distribution = calculate_vat_distribution positions
    vat_distribution.map do |vat, factor|
      {
        factor: factor,
        vat: vat,
        value: (total_with_discounts.to_i * vat.to_f * factor).to_i
      }
    end
  end

  def calculate_vat_distribution(positions)
    vat_groups = group_by_vat positions
    vat_subtotals = vat_groups.map { |vat, vat_positions| [vat, calculate_subtotal(vat_positions)] }.to_h
    vat_total = vat_subtotals.inject(0) { |sum, (_vat, vat_subtotal)| sum + vat_subtotal }
    # calculate the vat distribution by dividing each subtotal by the total
    vat_subtotals.map { |vat, subtotal| [vat, vat_total == 0 ? 0 : subtotal / vat_total] }.to_h
  end

  def group_by_vat(positions)
    positions.map { |p| p.vat.round(4).to_s }.uniq.map { |vat_key| [vat_key, positions.select { |p| p.vat.round(4).to_s == vat_key }] }.to_h
  end

  def apply_discount(subtotal, discount)
    if discount.percentage
      apply_discount_factor subtotal, discount
    else
      apply_discount_fixed discount
    end
  end

  def apply_discount_factor(subtotal, discount)
    {
      name: "#{discount.name} (#{discount.value * 100}%)",
      value: (subtotal * discount.value * -1).to_i
    }
  end

  def apply_discount_fixed(discount)
    {
      name: discount.name.to_s,
      value: (discount.value * -1).to_i
    }
  end
end

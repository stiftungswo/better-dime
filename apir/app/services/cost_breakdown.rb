class CostBreakdown
  def initialize(positions, discounts, position_groupings, fixed_price)
    @positions = positions
    @discounts = discounts
    @position_groupings = position_groupings
    @fixed_price = fixed_price
  end

  def calculate
    positions = @positions.sort_by { |p| p.order }
    subtotal = calculate_subtotal positions
    discounts = @discounts.map {|discount| apply_discount subtotal, discount }
    discounts_total = discounts.inject(0){ |sum, d| sum + d[:value] }
    total_with_discounts = subtotal + discounts_total
    vats = calculate_vats positions, total_with_discounts
    vats_total = vats.inject(0){ |sum, v| sum + v[:value] }
    total = total_with_discounts + vats_total

    fixed_price_vats = []
    fixed_price_vats_sum = 0.0;

    if not @fixed_price.nil?
      vats.each do |vat|
        ratio = vat[:value] * (1.0/vat[:vat].to_f)/subtotal;
        fixed_price_vats_val = (@fixed_price*ratio - (@fixed_price*ratio/(1 + vat[:vat].to_f))).round
        fixed_price_vats_sum += fixed_price_vats_val

        fixed_price_vats.push({
          :vat => vat[:vat],
          :value => fixed_price_vats_val.to_s
        })
      end
    end

    grouped_positions = get_grouped_positions @positions, @position_groupings

    {
      :discounts => discounts,
      :discount_total => discounts_total,
      :grouped_positions => grouped_positions,
      :sub_total => subtotal,
      :raw_total => total_with_discounts,
      :total => total,
      :vats => vats,
      :vat_total => vats_total,
      :fixed_price => @fixed_price,
      :fixed_price_vats => fixed_price_vats,
      :fixed_price_vats_sum => fixed_price_vats_sum
    }
  end

  def get_grouped_positions(positions, groups)
    default_positions = positions.select do |p|
      p.position_group_id.nil?
    end

    default_group = [{
      :group_name => 'Generell',
      :positions => default_positions,
      :subtotal => calculate_subtotal(default_positions)
    }]

    grouped_positions = groups.map do |group|
      filtered_positions = positions.select do |p|
        p.position_group_id == group.id
      end

      {
        :group_name => group.name,
        :positions => filtered_positions,
        :subtotal => calculate_subtotal(filtered_positions)
      }
    end
    grouped_positions = grouped_positions.concat default_group
    grouped_positions = grouped_positions.sort_by do |group|
      group[:group_name]
    end
    grouped_positions = grouped_positions.select do |group|
      group[:positions].length > 0
    end
  end

  def calculate_subtotal(positions)
    positions.inject(0) do |sum, p|
      sum + p.calculated_total
    end
  end

  def calculate_vats(positions, total_with_discounts)
    vat_values = []
    vat_distribution = calculate_vat_distribution positions

    vat_distribution.each do |vat, factor|
      vat_values.push({
        :factor => factor,
        :vat => vat,
        :value => (total_with_discounts.to_i * vat.to_f * factor).to_i
      })
    end

    vat_values
  end

  def calculate_vat_distribution(positions)
    sums = {}
    total = 0
    vat_groups = group_by_vat positions

    vat_groups.each do |vat, vat_positions|
      sum = calculate_subtotal vat_positions
      sums[vat] = sum
      total += sum
    end

    distributions = {}
    sums.each do |vat, sum|
      distributions[vat] = total == 0 ? 0 : sum / total
    end

    distributions
  end

  def group_by_vat(positions)
    vat_groups = {}

    positions.each do |position|
      vat = "#{position.vat}"

      vat_groups[vat] = [] unless vat_groups.key? vat
      vat_groups[vat].push position
    end

    vat_groups
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
      :name => "#{discount.name} (#{discount.value * 100}%)",
      :value => (subtotal * discount.value * -1).to_i
    }
  end

  def apply_discount_fixed(discount)
    {
      :name => "#{discount.name}",
      :value => (discount.value * -1).to_i
    }
  end
end

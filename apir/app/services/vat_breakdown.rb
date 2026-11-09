# frozen_string_literal: true

# Splits the discounted net total and its VAT per VAT rate and cost group. All amounts are exact Rappen and add up
# exactly: the net rows to the net total, the VAT rows to the total VAT. VAT is calculated per rate on that rate's
# net amount and rounded half up to the Rappen. The remaining difference to the 5 Rappen payable total is shown
# separately as rounding by the caller.
class VatBreakdown
  # distribution: { "0.077" => { factor: 0.6, ... } }, costgroups: { cost group number => percentage }
  def initialize(distribution, net_total, costgroups)
    @distribution = distribution
    @net_total = net_total.to_i
    @costgroups = costgroups
  end

  def calculate
    rates = rate_amounts

    { by_costgroup: rates.to_h { |amounts| [amounts[:rate], costgroup_rows(amounts)] }, total: rates.sum { |amounts| amounts[:vat] } }
  end

  private

  def rate_amounts
    nets = cancelled? ? cancelled_nets : split(factors.map { |factor| @net_total * factor }, @net_total)
    @distribution.keys.zip(nets).map { |rate, net| { rate: rate, net: net, vat: (net * rate.to_s.to_r).round } }
  end

  def factors
    @distribution.values.map { |details| details[:factor].to_f }
  end

  # The shares are undefined if the rates' subtotals cancel out (e.g. credits against charges).
  def cancelled?
    factors.sum.zero?
  end

  # Every rate keeps its own signed subtotal, so the VAT of a taxable position is still due. Only what is left over
  # (the discounts) is split evenly.
  def cancelled_nets
    subtotals = @distribution.values.map { |details| details[:subtotal].to_i }
    leftover = @net_total - subtotals.sum
    even = split(Array.new(subtotals.size) { leftover.to_f / subtotals.size }, leftover)
    subtotals.zip(even).map(&:sum)
  end

  def costgroup_rows(amounts)
    factor = @distribution[amounts[:rate]][:factor]

    @costgroups.keys.zip(split_by_costgroup(amounts[:net]), split_by_costgroup(amounts[:vat])).map do |cg, net, vat|
      { cg: cg, subtotal: net, factor: factor, value: vat }
    end
  end

  def split_by_costgroup(amount)
    percentages = @costgroups.values.map { |percentage| percentage.to_f / 100.0 }
    complete = (percentages.sum - 1.0).abs < 0.0001
    split(percentages.map { |p| amount * p }, complete ? amount : (amount * percentages.sum).round)
  end

  def split(values, target)
    FiveRappenAllocator.allocate(values, target, step: 1)
  end
end

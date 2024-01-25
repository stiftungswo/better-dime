# frozen_string_literal: true

json.extract! invoice, :id, :accountant_id, :address_id, :customer_id, :description,
              :fixed_price, :fixed_price_vat, :name, :beginning, :ending, :sibling_invoice_ids, :created_at, :location_id

json.project_id invoice.project.id if invoice.project
json.offer_id invoice.project.offer.id unless invoice.project.nil? || invoice.project.offer.nil?

json.breakdown do
  json.discounts invoice.breakdown[:discounts]
  json.discountTotal invoice.breakdown[:discount_total]
  json.positions invoice.breakdown[:positions]
  json.rawTotal invoice.breakdown[:raw_total]
  json.subtotal invoice.breakdown[:subtotal]
  json.total invoice.breakdown[:total]
  json.vats invoice.breakdown[:vats]
  json.vatTotal invoice.breakdown[:vat_total]
end

json.costgroup_distributions invoice.invoice_costgroup_distributions.map do |ic|
  json.costgroup_number ic.costgroup_number
  json.invoice_id ic.invoice_id
  if invoice.project.costgroup_sums.key?(ic.costgroup_number)
    json.distribution invoice.project.costgroup_distribution(ic.costgroup_number)
  else
    0.00.to_f
  end
end
json.costgroup_uncategorized_distribution invoice.project.missing_costgroup_distribution if invoice.project.costgroup_dist_incomplete?

json.project_id invoice.project&.id
json.discounts invoice.invoice_discounts
json.positions invoice.invoice_positions.sort_by { |p| p.order.to_i } do |position|
  json.extract! position.decorate, :id, :amount, :description, :price_per_rate, :rate_unit_id,
                :vat, :order, :position_group_id, :rate_unit_archived, :calculated_total
end
json.position_groupings invoice.position_groupings do |group|
  json.extract! group, :id, :name, :order, :shared
end

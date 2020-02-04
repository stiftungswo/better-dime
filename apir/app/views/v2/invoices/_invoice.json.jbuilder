json.extract! invoice, :id, :accountant_id, :address_id, :customer_id, :description,
              :fixed_price, :fixed_price_vat, :name, :beginning, :ending, :sibling_invoice_ids, :created_at

json.project_id invoice.project.id unless invoice.project.nil?
json.offer_id invoice.project.offer.id unless invoice.project.nil? or invoice.project.offer.nil?

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

json.costgroup_distributions invoice.invoice_costgroup_distributions
json.project_id invoice.project&.id
json.discounts invoice.invoice_discounts
json.positions invoice.invoice_positions.sort_by { |p| p.order } do |position|
  json.extract! position.decorate, :id, :amount, :description, :price_per_rate, :rate_unit_id,
                :vat, :order, :position_group_id, :rate_unit_archived, :calculated_total
end
json.position_groupings invoice.position_groupings do |group|
  json.extract! group, :id, :name
end

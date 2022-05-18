# frozen_string_literal: true

json.extract! offer, :id, :accountant_id, :address_id, :customer_id, :description,
              :fixed_price, :fixed_price_vat, :name, :rate_group_id, :short_description, :status,
              :created_at, :location_id

json.project_id offer.project.id if offer.project

json.breakdown do
  json.discounts offer.breakdown[:discounts]
  json.discountTotal offer.breakdown[:discount_total]
  json.positions offer.breakdown[:positions]
  json.rawTotal offer.breakdown[:raw_total]
  json.subtotal offer.breakdown[:subtotal]
  json.total offer.breakdown[:total]
  json.vats offer.breakdown[:vats]
  json.vatTotal offer.breakdown[:vat_total]
end
json.invoice_ids offer.invoice_ids
json.project_id offer.project&.id
json.discounts offer.offer_discounts

json.category_distributions offer.offer_category_distributions
json.costgroup_distributions offer.offer_costgroup_distributions
json.positions offer.offer_positions.sort_by(&:order) do |position|
  json.extract! position, :id, :amount, :description, :price_per_rate, :rate_unit_id, :service_id,
                :vat, :order, :position_group_id, :service, :rate_unit_archived
end
json.position_groupings offer.position_groupings do |group|
  json.extract! group, :id, :name, :order, :shared
end

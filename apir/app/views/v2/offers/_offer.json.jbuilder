# frozen_string_literal: true

json.extract! offer, :id, :accountant_id, :address_id, :customer_id, :description,
              :fixed_price, :fixed_price_vat, :name, :rate_group_id, :short_description, :status,
              :created_at, :location_id

json.project_id offer.project.id if offer.project

json.breakdown do
  json.discounts offer.breakdown[:discounts]
  json.discountTotal offer.breakdown[:discount_total]
  json.rawTotal offer.breakdown[:raw_total]
  json.subtotal offer.breakdown[:subtotal]
  json.total offer.breakdown[:total]
  json.vatTotal offer.breakdown[:vat_total]
end
json.invoice_ids offer.invoice_ids
json.project_id offer.project&.id
json.discounts offer.offer_discounts do |discount|
  json.extract! discount, :id, :offer_id, :name, :percentage, :value, :created_at, :updated_at
end

json.category_distributions offer.offer_category_distributions do |dist|
  json.extract! dist, :id, :offer_id, :category_id, :weight, :created_at, :updated_at
end
json.costgroup_distributions offer.offer_costgroup_distributions do |dist|
  json.extract! dist, :id, :offer_id, :costgroup_number, :weight, :created_at, :updated_at
end
json.positions offer.offer_positions.sort_by(&:order) do |position|
  json.extract! position, :id, :amount, :description, :price_per_rate, :rate_unit_id, :service_id,
                :vat, :order, :position_group_id, :rate_unit_archived
  json.service do
    if position.service
      json.extract! position.service, :id, :name, :description, :vat, :order, :local_order, :archived, :service_category_id
    end
  end
end
json.position_groupings offer.position_groupings do |group|
  json.extract! group, :id, :name, :order, :shared
end

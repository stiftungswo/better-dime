json.extract! offer, :id, :accountant_id, :address_id, :customer_id, :description,
              :fixed_price, :fixed_price_vat, :name, :rate_group_id, :short_description, :status,
              :created_at

if offer.project.nil?
  # add empty invoice id list
  json.invoice_ids []
else
  # add invoice ids
  json.invoice_ids offer.project.invoices do |invoice|
    json.extract! invoice, :id
  end
end

json.project_id offer.project.id unless offer.project.nil?

# add discounts
json.discounts offer.offer_discounts do |discount|
  json.extract! discount, :id, :name, :offer_id, :percentage, :value
end

json.breakdown offer.breakdown
json.invoice_ids offer.invoice_ids
json.project_id offer.project&.id
json.discounts offer.offer_discounts
json.positions offer.offer_positions
json.position_groupings offer.position_groupings do |group|
  json.extract! group, :id, :name
end

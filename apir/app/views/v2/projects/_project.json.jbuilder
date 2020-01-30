json.extract! project, :id, :accountant_id, :address_id, :customer_id, :archived, :description,
              :fixed_price, :name, :rate_group_id,
              :created_at, :chargeable, :deadline, :vacation_project, :budget_price, :budget_time,
              :current_price, :current_time

json.category_id project.project_category.id unless project.project_category.nil?
json.offer_id project.offer.id unless project.offer.nil?
# add invoice ids
json.invoice_ids project.invoice_ids

json.costgroup_distributions project.project_costgroup_distributions
json.positions project.project_positions.sort_by { |p| p.order } do |position|
  json.extract! position, :id, :description, :price_per_rate, :rate_unit_id, :service_id,
                          :vat, :order, :position_group_id, :efforts_value_with_unit, :charge,
                          :rate_unit_archived, :deletable
end
json.position_groupings project.position_groupings do |group|
  json.extract! group, :id, :name
end

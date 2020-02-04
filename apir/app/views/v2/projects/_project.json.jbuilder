# frozen_string_literal: true

json.extract! project, :id, :accountant_id, :address_id, :customer_id, :archived, :description,
              :fixed_price, :name, :rate_group_id,
              :created_at, :chargeable, :deadline, :vacation_project, :budget_price, :budget_time,
              :current_price, :current_time

json.category_id project.project_category.id if project.project_category
json.offer_id project.offer.id if project.offer
# add invoice ids
json.invoice_ids project.invoice_ids

json.costgroup_distributions project.project_costgroup_distributions
json.positions project.project_positions.sort_by(&:order) do |position|
  json.extract! position, :id, :description, :price_per_rate, :rate_unit_id, :service_id,
                :vat, :order, :position_group_id, :efforts_value_with_unit, :charge,
                :rate_unit_archived, :deletable, :service, :is_time
end
json.position_groupings project.position_groupings do |group|
  json.extract! group, :id, :name
end

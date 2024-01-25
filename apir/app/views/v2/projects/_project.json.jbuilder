# frozen_string_literal: true

json.extract! project, :id, :accountant_id, :address_id, :customer_id, :archived, :description,
              :fixed_price, :name, :rate_group_id, :location_id,
              :created_at, :chargeable, :deadline, :vacation_project, :budget_price, :budget_time,
              :current_price, :current_time

json.offer_id project.offer.id if project.offer
# add invoice ids
json.invoice_ids project.invoice_ids

json.category_distributions project.project_category_distributions

json.costgroup_distributions project.project_costgroup_distributions.map do |pc|
  json.costgroup_number pc.costgroup_number
  json.project_id pc.project_id
  if project.costgroup_sums.key?(pc.costgroup_number)
    json.distribution project.costgroup_distribution(pc.costgroup_number)
  else
    0.00.to_f
  end
end
json.costgroup_uncategorized_distribution project.missing_costgroup_distribution if project.costgroup_dist_incomplete?

json.positions project.project_positions.sort_by(&:order) do |position|
  json.extract! position, :id, :description, :price_per_rate, :rate_unit_id, :service_id,
                :vat, :order, :position_group_id, :efforts_value_with_unit, :charge,
                :rate_unit_archived, :deletable, :service, :is_time
end
json.position_groupings project.position_groupings do |group|
  json.extract! group, :id, :name, :order, :shared
end

# frozen_string_literal: true

json.extract! project, :id, :accountant_id, :address_id, :customer_id, :archived, :description,
              :fixed_price, :name, :rate_group_id, :location_id,
              :created_at, :chargeable, :deadline, :vacation_project, :budget_price, :budget_time,
              :current_price, :current_time

json.offer_id project.offer.id if project.offer
# add invoice ids
json.invoice_ids project.invoice_ids

json.category_distributions project.project_category_distributions.map do |pc|
  json.category_id pc.category_id
  json.project_id pc.project_id
  if @category_sums.key?(pc.project_category.id)
    json.distribution ((@category_sums[pc.project_category.id] / @categories_sum) * 100).to_f
  else
    0.00.to_f
  end
end
json.uncategorized_distribution ((@category_sums[nil] / @categories_sum) * 100).to_f if @category_sums.key?(nil)
json.costgroup_distributions project.project_costgroup_distributions
json.positions project.project_positions.sort_by(&:order) do |position|
  json.extract! position, :id, :description, :price_per_rate, :rate_unit_id, :service_id,
                :vat, :order, :position_group_id, :efforts_value_with_unit, :charge,
                :rate_unit_archived, :deletable, :service, :is_time
end
json.position_groupings project.position_groupings do |group|
  json.extract! group, :id, :name, :order, :shared
end

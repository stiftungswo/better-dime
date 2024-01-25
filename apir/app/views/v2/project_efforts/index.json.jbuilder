# frozen_string_literal: true

json.array! @efforts do |effort|
  json.extract! effort, :id, :date, :position_id
  json.effort_value effort.value
  json.effort_employee_id effort.employee_id
  json.employee_full_name "#{effort.e_first_name} #{effort.e_last_name}"
  json.position_description effort.p_desc
  json.project_name effort.p_name
  json.project_id effort.p_id
  json.service_id effort.s_id
  json.costgroup_number effort.costgroup_number
  json.costgroup_name effort.costgroup&.name
  json.service_name effort.s_name
  json.effort_unit effort.effort_unit
  json.rate_unit_factor effort.rate_unit_factor if effort.rate_unit_factor.present?
  json.rate_unit_is_time effort.rate_unit_is_time
  json.group_name effort.group_name if effort.group_name.present?
  json.is_ambiguous @ambiguity_count[[effort.p_id, effort.s_id]] > 1
end

# frozen_string_literal: true

json.extract! @effort, :id, :date, :position_id, :employee_id, :value, :costgroup_number
json.project_id @effort.project_position.project.id

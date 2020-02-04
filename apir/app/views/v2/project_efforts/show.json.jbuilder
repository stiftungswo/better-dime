json.extract! @effort, :id, :date, :position_id, :employee_id, :value
json.project_id @effort.project_position.project.id

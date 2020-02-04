# frozen_string_literal: true

# json.partial! 'pagination', pagination: @employee_groups
# json.set! :data do
json.array! @employee_groups do |employee_group|
  json.extract! employee_group.decorate, :id, :name, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
end
# end

# frozen_string_literal: true

# json.partial! "pagination", pagination: @project_categories
# json.set! :data do
json.array! @project_categories do |project_category|
  json.extract! project_category.decorate, :id, :archived, :name, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by
end
# end

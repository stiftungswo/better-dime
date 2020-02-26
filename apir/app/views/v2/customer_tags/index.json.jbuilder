# frozen_string_literal: true

# json.partial! "pagination", pagination: @customer_tags
# json.set! :data do
json.array! @customer_tags do |customer_tag|
  json.extract! customer_tag.decorate, :id, :archived, :name, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
end
# end
